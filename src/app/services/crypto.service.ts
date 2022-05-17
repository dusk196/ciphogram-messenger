import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { pki, util, cipher, random, pkcs5 } from 'node-forge';
import { environment } from 'src/environments/environment';
import { UuidService } from 'src/app/services/uuid.service';
import { IRsaKeyPair } from 'src/app/types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  private rsaKeyPair: IRsaKeyPair = { privateKey: '', publicKey: '' };

  constructor(private readonly _router: Router, private readonly _uuidService: UuidService) {
    this.generateRsaKeyPair();
  }

  /**
   * Generate RSA key pair
   * @returns {IRsaKeyPair}
   */
  private generateRsaKeyPair(): void {
    pki.rsa.generateKeyPair(environment.rsa, (err, keypair) => {
      if (err) {
        console.error(err);
        this._router.navigate(['/error']);
      }
      const publicKey = pki.publicKeyToPem(keypair.publicKey);
      const privateKey = pki.privateKeyToPem(keypair.privateKey);
      this.rsaKeyPair = cloneDeep({ privateKey, publicKey });
    });
  }

  /**
   * Returns RSA public key
   * @returns {string}
   */
  getRsaPublicKey(): string {
    return this.rsaKeyPair.publicKey;
  }

  /**
   * Encrypts data by RSA
   * @param data
   * @param publicKey
   * @returns {string}
   */
  encryptDataByRsa(data: string, publicKey: string): string {
    const pub = pki.publicKeyFromPem(publicKey);
    const encrypted = pub.encrypt(data);
    return util.encode64(encrypted);
  }

  /**
   * Decrypts data by RSA
   * @param data
   * @returns  {string}
   */
  decryptDataByRsa(data: string): string {
    const priv = pki.privateKeyFromPem(this.rsaKeyPair.privateKey);
    const decrypted = priv.decrypt(util.decode64(data));
    return decrypted;
  }

  /**
   * Fetches a random AES secret
   * @returns {string}
   */
  private getAesSecret(): string {
    const salt = random.getBytesSync(16);
    const iv = random.getBytesSync(16);
    const password = this._uuidService.generateUuid();
    const key = pkcs5.pbkdf2(password, salt, 100000, 256 / 8);
    const secret = iv + key;
    return secret;
  }

  /**
   * Encrypts data by AES
   * @param text
   * @param rsaPublicKey
   * @returns {string}
   */
  encryptDataByAes(text: string, rsaPublicKey: string): string {
    const secret = this.getAesSecret();
    const iv = secret.slice(0, 16);
    const key = secret.slice(16, 48);
    const aesCipher = cipher.createCipher('AES-CBC', key);
    aesCipher.start({ iv: iv });
    aesCipher.update(util.createBuffer(text));
    aesCipher.finish();
    const encrypted = util.encode64(aesCipher.output.bytes());
    const superSecret = this.encryptDataByRsa(secret, rsaPublicKey);
    const final = superSecret + encrypted;
    return final;
  }

  /**
   * Decrypts data by AES
   * @param text
   * @returns {string}
   */
  decryptDataByAes(text: string): string {
    const superSecret = this.decryptDataByRsa(text.slice(0, 88));
    const encrypted = util.decode64(text.slice(88));
    const iv = superSecret.slice(0, 16);
    const key = superSecret.slice(16, 48);
    const aesCipher = cipher.createDecipher('AES-CBC', key);
    aesCipher.start({ iv: iv });
    aesCipher.update(util.createBuffer(encrypted));
    aesCipher.finish();
    const decrypted = aesCipher.output.toString();
    return decrypted;
  }

}
