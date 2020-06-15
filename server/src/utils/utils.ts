import fs from "fs";
import path from "path";

/**
 * 删除对象中 value 为空的 key
 * @param data
 */
export function filterObjectEmptyValue<T extends {}>(data: T) {
  const result: any = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== null && v !== void 0) {
      result[k as string] = v as any;
    }
  }
  return result;
}

export function randomString() {
  const str = "ABCDEFGHIJKIMZOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "BK-";
  for (let i = 0; i < 6; i++) {
    result += str[Math.floor(Math.random() * 62)];
  }
  return result;
}

export function createFolder(to: string) {
  const sep = path.sep;
  const folders = path.dirname(to).split(sep);
  let p = "";
  while (folders.length) {
    p += folders.shift() + sep;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
}
