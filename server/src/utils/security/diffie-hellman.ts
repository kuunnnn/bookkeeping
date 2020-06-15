import crypto from "crypto";

export class ECDH {
  private ecdh: crypto.ECDH;

  constructor() {
    this.ecdh = crypto.createECDH("secp256k1");
  }

  getPublicKey() {
    return this.ecdh.generateKeys("hex");
  }

  getSecret(key: string) {
    return this.ecdh.computeSecret(key, "hex", "hex");
  }
}

export class DiffieHellman {
  dh: crypto.DiffieHellman;

  constructor(prime = "fc2c54482e688816081064dd3832079b", generator = "05") {
    this.dh = crypto.createDiffieHellman(prime, "hex", generator, "hex");
  }

  static createPrime(primeLength = 128, generator = 2) {
    const dh = crypto.createDiffieHellman(primeLength, generator);
    return dh.getPrime("hex");
  }

  getKey(): string {
    return this.dh.generateKeys("hex");
  }

  generateKeys() {
    return this.dh.generateKeys("hex");
  }

  getPrivateKey(): string {
    return this.dh.getPrivateKey("hex");
  }

  getPublicKey(): string {
    return this.dh.getPublicKey("hex");
  }

  getGenerator(): string {
    return this.dh.getGenerator("hex");
  }

  setPrivateKey(key: string) {
    this.dh.setPrivateKey(key, "hex");
  }

  setPublicKey(key: string) {
    this.dh.setPublicKey(key, "hex");
  }

  getSecret(key: string): string {
    return this.dh.computeSecret(key, "hex", "hex");
  }
}
