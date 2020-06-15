import pinyin from "pinyin";

export class PinyinService {
  static pinyin(text: string): string {
    try {
      return pinyin(text, { style: pinyin.STYLE_NORMAL })[0][0];
    } catch (e) {
      return "";
    }
  }
}
