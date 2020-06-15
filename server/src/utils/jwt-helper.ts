import jwt from "jsonwebtoken";
import { v4 } from "uuid";

import { Env } from "../config";
import { redis } from "../connect/redis";
import { logger } from "../logger/logger";

export interface JwtPayload {
  userId: number;
}

export interface OriginalJwtPayload {
  userId: number;
  iat: number;
  exp: number;
  aud: string;
  jti: string;
}

export class JwtHelper {
  /**
   * 登录 token
   * @param payload
   */
  static token(payload: JwtPayload) {
    return JwtHelper.sign(payload, "1d");
  }

  /**
   * refresh token
   * @param payload
   */
  static refreshToken(payload: JwtPayload) {
    return JwtHelper.sign(payload, "7d");
  }

  /**
   * 验证jwt签名
   * @param token
   */
  static async verify(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, Env.jwt_secret, (err, decoded) => {
        if (err !== null && err !== undefined) {
          reject(err);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  }

  /**
   * jwt 解码 不会验证签名有效性
   * @param token
   */
  static decode(token: string): JwtPayload {
    const decoded = jwt.decode(token, { complete: true });
    return decoded as JwtPayload;
  }

  /**
   * 吊销 token
   * @param token
   */
  static async revokeToken(token: string): Promise<boolean> {
    const decode = (await JwtHelper.decode(token)) as OriginalJwtPayload;
    const sec = decode.exp - decode.iat;
    // token 如果已经过期就不要管了
    if (sec < 0) {
      if (Env.__DEV__) {
        logger.info("token 已经过期: %s", token);
      }
      return true;
    }
    // 只有拥有 jti 和 aud 两个字段才能被吊销
    if (!decode.jti || !decode.aud) {
      return false;
    }
    await redis.setex(`revoked-token:${decode.aud}-${decode.jti}`, sec, token);
    return true;
  }

  /**
   * token 是否被吊销了
   * @param decode
   */
  static async isRevoked(decode: OriginalJwtPayload) {
    if (!decode.jti || !decode.aud) {
      return true;
    }
    const token = await redis.get(`revoked-token:${decode.aud}-${decode.jti}`);
    return token !== null;
  }

  /**
   * 进行 jwt 签名
   * @param payload
   * @param seconds
   */
  private static sign(payload: JwtPayload, seconds: string | number = 60 * 60) {
    // exp: Math.floor( Date.now() / 1000 ) + seconds
    return jwt.sign(payload, Env.jwt_secret, {
      expiresIn: seconds,
      jwtid: v4(),
      audience: "bookkeeping",
    });
  }
}
