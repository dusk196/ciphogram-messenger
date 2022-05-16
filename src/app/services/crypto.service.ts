import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { pki, util, cipher, random, pkcs5 } from 'node-forge';
import { environment } from 'src/environments/environment';
import { IRsaKeyPair } from '../types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  private rsaKeyPair: IRsaKeyPair = { privateKey: '', publicKey: '' };
  // private readonly rsaKeyPair: IRsaKeyPair = pki.rsa.generateKeyPair(environment.rsa, (err, keypair) => {
  //   if (err) {
  //     console.error(err);
  //     return { privateKey: null, publicKey: null };
  //   }
  //   console.log('keypair: ', keypair);
  //   // return keypair;
  //   const priv = keypair.privateKey;
  //   const pub = keypair.publicKey;

  //   console.log(keypair);

  //   console.log('priv: ', priv, 'pub: ', pub);
  //   // PEM serialize: public key
  //   const pubPem = pki.publicKeyToPem(pub);
  //   console.log("Public Key PEM:", pubPem);
  //   const pub2 = pki.publicKeyFromPem(pubPem);

  //   // PEM serialize: private key
  //   const privPem = pki.privateKeyToPem(priv);
  //   console.log("Private Key PEM:", privPem);
  //   const priv2 = pki.privateKeyFromPem(privPem);
  //   return { privateKey: privPem, publicKey: pubPem };
  // });

  constructor(private readonly _router: Router,) {
    this.letsTryAES();
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

  letsTryAES() {
    const salt = random.getBytesSync(16);
    const iv = random.getBytesSync(16);

    const superSecretPassword = "I'm a super secret password!";

    const key = pkcs5.pbkdf2(superSecretPassword, salt, 100000, 256 / 8);

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

  encryptMessage(msg: string) {
    // let encodedMsg = this.getEncoded(msg);
    // console.log('encodedMsg: ', encodedMsg);
    // return window.crypto.subtle.encrypt(
    //   { name: "RSA-OAEP" }, this.keyPair.publicKey, encodedMsg
    // )
  }

  async decryptMessage(msg: any) {
    // console.log('decryptMessage starts:');
    // console.log('decryptMessage to decrypt: ', msg);
    // let decrypted = await window.crypto.subtle.decrypt(
    //   {
    //     name: "RSA-OAEP"
    //   },
    //   this.keyPair.privateKey,
    //   msg
    // );
    // let dec = new TextDecoder();
    // console.log('decrypted', decrypted);
    // const d = dec.decode(decrypted);
    // console.log(d);
  }


  private getEncoded(text: string | undefined): Uint8Array {
    const encodedText: Uint8Array = new TextEncoder().encode(text);
    return encodedText;
  }

  private getDecoded(text: Uint8Array | undefined): string {
    const decodedText: string = new TextDecoder().decode(text);
    return decodedText;
  }

}
