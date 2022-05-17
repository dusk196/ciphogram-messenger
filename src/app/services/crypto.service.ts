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
    this.letsTryAES();
  }

  letsTryAES() {
    const salt = random.getBytesSync(16);
    const iv = random.getBytesSync(16);

    const superSecretPassword = "I'm a super secret password!";

    const key = pkcs5.pbkdf2(superSecretPassword, salt, 100000, 256 / 8);

    console.log('key: ', key);

    const varcipher = cipher.createCipher('AES-CBC', key);

    varcipher.start({ iv: iv });
    varcipher.update(util.createBuffer('That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text That is our super secret text '));
    varcipher.finish();

    const encrypted = varcipher.output.bytes();

    console.log({
      iv: util.encode64(iv),
      salt: util.encode64(salt),
      encrypted: util.encode64(encrypted),
      concatenned: util.encode64(salt + iv + encrypted)
    });


    // const encrypted = forge.util.binary.base64.decode('sYoCiGLJ9xuH3qBLoBzNlNn9DwkecP/GuMv+RuEhoiz0th+PXBSuSujz5r7p/quCUeVVf2qPw3gQwLyKMyOntA=='
    // );

    const salt_len = 16, iv_len = 16;

    // const salt = forge.util.createBuffer(encrypted.slice(0, salt_len));
    // const iv = forge.util.createBuffer(encrypted.slice(0 + salt_len, salt_len + iv_len));

    // const key = forge.pkcs5.pbkdf2('my password', salt.bytes(), 100000, 256 / 8, 'SHA256');
    const decipher = cipher.createDecipher('AES-CBC', key);

    decipher.start({ iv: iv });
    decipher.update(
      // util.createBuffer(encrypted.slice(salt_len + iv_len))
      util.createBuffer(encrypted)
    );
    decipher.finish();

    console.log(decipher.output.toString());
  }

  generateRsaKeyPair(): void {
    pki.rsa.generateKeyPair(environment.rsa, (err, keypair) => {
      if (err) {
        console.error(err);
        this._router.navigate(['/error']);
      }
      console.log('keypair: ', keypair);
      const priv = keypair.privateKey;
      const pub = keypair.publicKey;
      console.log('priv: ', priv, 'pub: ', pub);
      // PEM serialize: public key
      const pubPem = pki.publicKeyToPem(pub);
      console.log("Public Key PEM:", pubPem);
      // const pub2 = pki.publicKeyFromPem(pubPem);
      // PEM serialize: private key
      const privPem = pki.privateKeyToPem(priv);
      console.log("Private Key PEM:", privPem);
      // const priv2 = pki.privateKeyFromPem(privPem);
      this.rsaKeyPair = cloneDeep({ privateKey: privPem, publicKey: pubPem });
    });
  }

  getAesSecret(): string {
    const salt = random.getBytesSync(16);
    const iv = random.getBytesSync(16);
    const password = this._uuidService.generateUuid();
    const key = pkcs5.pbkdf2(password, salt, 100000, 256 / 8);
    const secret = iv + key;
    console.log('secret: ', util.encode64(secret));
    return secret;
  }

  encryptDataByAes(text: string): string {
    const secret = this.getAesSecret();
    const iv = secret.slice(0, 16);
    const key = secret.slice(16, 48);
    const aesCipher = cipher.createCipher('AES-CBC', key);
    aesCipher.start({ iv: iv });
    aesCipher.update(util.createBuffer(text));
    aesCipher.finish();
    const encrypted = aesCipher.output.bytes();
    console.log('encrypted: ', encrypted);
    const final = util.encode64(secret + encrypted);
    return final;
  }

  decryptDataByAes(text: string): string {
    const decodedSecret = util.decode64(text);
    const secret = decodedSecret.slice(0, 48);
    const encrypted = decodedSecret.slice(48);
    const iv = secret.slice(0, 16);
    const key = secret.slice(16, 48);
    const aesCipher = cipher.createDecipher('AES-CBC', key);
    aesCipher.start({ iv: iv });
    aesCipher.update(util.createBuffer(encrypted));
    aesCipher.finish();
    const decrypted = aesCipher.output.toString();
    console.log('decrypted: ', decrypted);
    for (let i = 0; i < 20000; i++) {
      console.log(i)
    }
    return decrypted;
  }

  getRsaPublicKey(): string {
    return this.rsaKeyPair.publicKey;
  }

  letsTryRSA() {

    // Max 256 chars
    const txt = '123456789012345678901234567890123456789012345678';

    const pub2 = pki.publicKeyFromPem(this.rsaKeyPair.publicKey);
    const priv2 = pki.privateKeyFromPem(this.rsaKeyPair.privateKey);

    // make public key from private key
    // const pub3 = pki.rsa.setPublicKey(priv2.n, priv2.e);
    // console.log("Public key from private key:", pub3);

    // enc/dec with Obj Pub and PEM Priv
    // console.log("\n[Enc by Obj/Dec by PEM]");
    // const encrypted = pub.encrypt(txt);
    // console.log("encrypted(by Obj):", util.encode64(encrypted));
    // const decrypted = priv2.decrypt(encrypted);
    // console.log("decrypted(by PEM):", decrypted);

    // enc/dec with PEM Pub and Obj Priv
    console.log("\n[Enc by PEM/Dec by Obj]");
    const encrypted2 = pub2.encrypt(txt);
    console.log("encrypted(by PEM):", util.encode64(encrypted2));
    const decrypted2 = priv2.decrypt(encrypted2);
    console.log("decrypted(by Obj):", decrypted2);

    // enc/dec with Pub fron PEM Priv and Obj Priv
    // console.log("\n[Enc by Priv PEM/Dec by Obj]");
    // const encrypted3 = pub3.encrypt(txt);
    // console.log("encrypted(by Priv):", util.encode64(encrypted3));
    // const decrypted3 = priv.decrypt(encrypted3);
    // console.log("decrypted(by Obj):", decrypted3);
  }

}
