import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { pki, util, cipher, random, pkcs5 } from 'node-forge';
import { environment } from 'src/environments/environment';
import { UuidService } from 'src/app/services/uuid.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IRsaKeyPair } from 'src/app/types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  private rsaKeyPair: IRsaKeyPair = { privateKey: '', publicKey: '' };

  constructor(
    private readonly _router: Router,
    private readonly _uuidService: UuidService,
    private readonly _utilsService: UtilsService
  ) {
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
    this._utilsService.devConsoleLog('Your RSA Public key:', this.rsaKeyPair.publicKey);
    this._utilsService.devConsoleLog('Your super super super secret RSA Private key:', this.rsaKeyPair.privateKey);
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
    const encrypted = util.encode64(pub.encrypt(data));
    this._utilsService.devConsoleLog('AES Secret encrypted by RSA public key:', encrypted);
    return encrypted;
  }

  /**
   * Decrypts data by RSA
   * @param data
   * @returns  {string}
   */
  decryptDataByRsa(data: string): string {
    const priv = pki.privateKeyFromPem(this.rsaKeyPair.privateKey);
    const decrypted = priv.decrypt(util.decode64(data));
    this._utilsService.devConsoleLog('AES Secret decrypted by RSA private key:', util.encode64(decrypted));
    return decrypted;
  }

  /**
   * Fetches a random AES secret
   * @returns {iv, key}
   */
  private getAesSecret(): { iv: string, key: string } {
    const salt = random.getBytesSync(16);
    const iv = random.getBytesSync(16);
    const password = this._uuidService.generateUuid();
    const key = pkcs5.pbkdf2(password, salt, 100000, 256 / 8);
    this._utilsService.devConsoleLog('AES Salt: ', util.encode64(salt));
    this._utilsService.devConsoleLog('AES initialization vector (IV): ', util.encode64(iv));
    this._utilsService.devConsoleLog('AES password: ', util.encode64(password));
    this._utilsService.devConsoleLog('AES secret key: ', util.encode64(key));
    return { iv, key };
  }

  /**
   * Encrypts data by AES
   * @param text
   * @param rsaPublicKey
   * @returns {string}
   */
  encryptDataByAes(text: string, rsaPublicKey: string): string {
    const { iv, key } = this.getAesSecret();
    const aesCipher = cipher.createCipher('AES-CBC', key);
    aesCipher.start({ iv: iv });
    aesCipher.update(util.createBuffer(text));
    aesCipher.finish();
    const encrypted = util.encode64(aesCipher.output.bytes());
    const superSecret = this.encryptDataByRsa(iv + key, rsaPublicKey);
    const final = superSecret + encrypted;
    this._utilsService.devConsoleLog('Message encrypted by AES using AES Secret key & IV:', encrypted);
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
    this._utilsService.devConsoleLog('Message decrypted by AES using AES Secret key & IV:', decrypted);
    return decrypted;
  }

}
