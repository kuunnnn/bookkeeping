import svgCaptcha from "svg-captcha";

export class CaptchaService {
  // 生成二维码
  static createCaptcha() {
    return svgCaptcha.create();
  }
}
