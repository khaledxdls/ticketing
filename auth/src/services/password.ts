import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static toHash(password: string) {
    return new Promise(async (resolve, reject) => {
      const salt = randomBytes(8).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      resolve(`${buf.toString("hex")}.${salt}`);
    });
  }
  static compare(storedPassword: string, suppliedPassword: string) {
    return new Promise(async (resolve, reject) => {
      const [hashedPassword, salt] = storedPassword.split(".");
      const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
      resolve(buf.toString("hex") === hashedPassword);
    });
  }
}
