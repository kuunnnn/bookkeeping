import Joi from "@hapi/joi";
import Koa from "koa";

import { UserAccess } from "../access/user-access";
import { redis } from "../connect/redis";
import { TblUser } from "../entity/tbl-user";
import { Controller, JoiVerifyBody, Post } from "../lib/decorator-router";
import { throwHttpError } from "../utils/error-helper";
import { JwtHelper, JwtPayload } from "../utils/jwt-helper";
import { RegexTool } from "../utils/regex-tool";
import { AES_CBC } from "../utils/security/aes_cbc";
import { ECDH } from "../utils/security/diffie-hellman";
import { Bcrypt } from "../utils/security/hash";
import { randomString } from "../utils/utils";

@Controller("/")
export class AuthController {
  @Post("/pub/phoneIsUsed")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
    })
  )
  static async phoneIsUsed(ctx: Koa.Context) {
    const { phone } = ctx.request.body;
    const bool = await UserAccess.findByPhone(phone);
    ctx.body = { isUsed: !!bool };
  }

  @Post("/pub/exchangeSecret")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
      key: Joi.string().hex().required(),
    })
  )
  static async exchangeSecret(ctx: Koa.Context) {
    const { phone, key } = ctx.request.body;
    const ecdh = new ECDH();
    const serverKey = ecdh.getPublicKey();
    const secret = ecdh.getSecret(key);
    await redis.setex(`key:${phone}:secret`, 30, secret);
    ctx.body = { publicKey: serverKey };
  }

  @Post("/pub/genSalt")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
      iv: Joi.string().hex().required(),
    })
  )
  static async genSalt(ctx: Koa.Context) {
    const { phone, iv } = ctx.request.body;
    const secret = await redis.get(`key:${phone}:secret`);
    if (secret === null) {
      throwHttpError("未通过验证", 400);
    }
    const user = await UserAccess.findByPhone(phone);
    const salt = user ? user.salt : Bcrypt.genBcryptSalt();
    const encryptSalt = AES_CBC.encrypt(
      salt,
      AES_CBC.hexToBytes(secret),
      AES_CBC.hexToBytes(iv)
    );
    if (!user) {
      await redis.setex(`salt:${phone}`, 30, salt);
    }
    await redis.setex(`key:${phone}:client-iv`, 30, iv);
    ctx.body = { salt: encryptSalt };
  }

  @Post("/pub/register")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
      cipher: Joi.string().hex().required(),
    })
  )
  static async register(ctx: Koa.Context) {
    const { phone, cipher } = ctx.request.body;
    const iv = await redis.get(`key:${phone}:client-iv`);
    const secret = await redis.get(`key:${phone}:secret`);
    const salt = await redis.get(`salt:${phone}`);
    if (secret === null || iv === null || salt === null) {
      throwHttpError("未通过验证", 400);
    }
    await Promise.all([
      redis.del(`key:${phone}:client-iv`),
      redis.del(`key:${phone}:secret`),
      redis.del(`salt:${phone}`),
    ]);

    const password = AES_CBC.decrypt(
      cipher,
      AES_CBC.hexToBytes(secret),
      AES_CBC.hexToBytes(iv)
    );
    const user = await UserAccess.findByPhone(phone);
    if (user) {
      throwHttpError("该用户已存在!", 400);
    }
    const u = new TblUser();
    u.avatar = "";
    u.salt = salt as string;
    u.email = phone + "@phone.com";
    u.phone = phone;
    u.password = password;
    u.name = randomString();
    const userInfo = await UserAccess.create(u);
    console.log(userInfo);
    if (userInfo.identifiers.length === 0) {
      throwHttpError("创建用户失败!", 500);
    }
    ctx.body = {
      userInfo: user,
      access_token: JwtHelper.token({ userId: userInfo.identifiers[0].id }),
      refresh_token: JwtHelper.refreshToken({
        userId: userInfo.identifiers[0].id,
      }),
    };
  }

  @Post("/pub/login")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
      cipher: Joi.string().hex().required(),
    })
  )
  static async login(ctx: Koa.Context) {
    const { phone, cipher } = ctx.request.body;
    const iv = await redis.get(`key:${phone}:client-iv`);
    const secret = await redis.get(`key:${phone}:secret`);
    if (secret === null || iv === null) {
      throwHttpError("未通过验证", 400);
    }
    await Promise.all([
      redis.del(`key:${phone}:client-iv`),
      redis.del(`key:${phone}:secret`),
      redis.del(`salt:${phone}`),
    ]);
    const password = AES_CBC.decrypt(
      cipher,
      AES_CBC.hexToBytes(secret),
      AES_CBC.hexToBytes(iv)
    );
    const user = await UserAccess.findByPhone(phone);
    if (!user) {
      throwHttpError("Not found User!", 400);
    }
    if (!Bcrypt.safeStringCompare(user.password, password)) {
      throwHttpError("账户名或密码错误!", 400);
    }
    ctx.body = {
      userInfo: user,
      access_token: JwtHelper.token({ userId: user.id }),
      refresh_token: JwtHelper.refreshToken({ userId: user.id }),
    };
  }

  @Post("/logout")
  static async logout(ctx: Koa.Context) {
    if (!(ctx.state?.tbl as JwtPayload)?.userId) {
      ctx.throw("无效的凭证", 400);
    }
    const ok = await JwtHelper.revokeToken(ctx.state["token"]);
    ctx.body = { ok };
  }

  @Post("/tokenLogin")
  static async tokenLogin(ctx: Koa.Context) {
    ctx.body = { status: "ok" };
  }

  @Post("/pub/refreshToken")
  static async refreshToken(ctx: Koa.Context) {
    const refreshToken = ctx.request.header["X-REFRESH-TOKEN"];
    const token = ctx.request.header["authorization"];
    if (!token || !refreshToken) {
      ctx.throw("无效的凭证", 401);
    }
    const decode = await JwtHelper.verify(token);
    await JwtHelper.verify(refreshToken);
    // 新的 refreshToken 也需要延长时间
    await Promise.all([
      JwtHelper.revokeToken(token),
      JwtHelper.revokeToken(refreshToken),
    ]);
    ctx.body = {
      access_token: JwtHelper.token({ userId: decode.userId }),
      refresh_token: JwtHelper.refreshToken({ userId: decode.userId }),
    };
  }

  @Post("/pub/simpleRegister")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
      cipher: Joi.string().hex().required(),
    })
  )
  static async simpleRegister(ctx: Koa.Context) {
    const { phone, cipher } = ctx.request.body;
    const user = await UserAccess.findByPhone(phone);
    if (user) {
      throwHttpError("该手机已被使用!", 400);
    }
    const u = new TblUser();
    u.avatar = "";
    u.salt = "";
    u.email = phone + "@phone.com";
    u.phone = phone;
    u.password = cipher;
    u.name = randomString();
    const userInfo = await UserAccess.create(u);

    if (userInfo.identifiers.length === 0) {
      throwHttpError("创建用户失败!", 500);
    }
    ctx.body = {
      userInfo: user,
      access_token: JwtHelper.token({ userId: userInfo.identifiers[0].id }),
      refresh_token: JwtHelper.refreshToken({
        userId: userInfo.identifiers[0].id,
      }),
    };
  }

  @Post("/pub/simpleLogin")
  @JoiVerifyBody(
    Joi.object({
      phone: Joi.string().regex(RegexTool.phone).required(),
      cipher: Joi.string().hex().required(),
    })
  )
  static async simpleLogin(ctx: Koa.Context) {
    const { phone, cipher } = ctx.request.body;
    const user = await UserAccess.findByPhone(phone);
    if (!user) {
      throwHttpError("账户或密码不正确!", 400);
    }
    if (user.password !== cipher) {
      throwHttpError("账户或密码不正确!", 400);
    }
    ctx.body = {
      userInfo: user,
      access_token: JwtHelper.token({ userId: user.id }),
      refresh_token: JwtHelper.refreshToken({ userId: user.id }),
    };
  }
}
