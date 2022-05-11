import { Injectable } from '@angular/core';
import { pki, util } from 'node-forge';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  private keyPair: any;

  constructor() {
    const { privateKey, publicKey } = pki.rsa.generateKeyPair({ bits: 4096, workers: 2 }, (err, keypair) => {

      const txt = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';

      const priv = keypair.privateKey;
      const pub = keypair.publicKey;

      // PEM serialize: public key
      const pubPem = pki.publicKeyToPem(pub);
      console.log("Public Key PEM:", pubPem);
      const pub2 = pki.publicKeyFromPem(pubPem);

      // PEM serialize: private key
      const privPem = pki.privateKeyToPem(priv);
      console.log("Private Key PEM:", privPem);
      const priv2 = pki.privateKeyFromPem(privPem);

      // make public key from private key
      const pub3 = pki.rsa.setPublicKey(priv2.n, priv2.e);

      // enc/dec with Obj Pub and PEM Priv
      console.log("\n[Enc by Obj/Dec by PEM]");
      const encrypted = pub.encrypt(txt);
      console.log("encrypted(by Obj):", util.encode64(encrypted));
      const decrypted = priv2.decrypt(encrypted);
      console.log("decrypted(by PEM):", decrypted);

      // enc/dec with PEM Pub and Obj Priv
      console.log("\n[Enc by PEM/Dec by Obj]");
      const encrypted2 = pub2.encrypt(txt);
      console.log("encrypted(by PEM):", util.encode64(encrypted2));
      const decrypted2 = priv.decrypt(encrypted2);
      console.log("decrypted(by Obj):", decrypted2);

      // enc/dec with Pub fron PEM Priv and Obj Priv
      console.log("\n[Enc by Priv PEM/Dec by Obj]");
      const encrypted3 = pub3.encrypt(txt);
      console.log("encrypted(by Priv):", util.encode64(encrypted3));
      const decrypted3 = priv.decrypt(encrypted3);
      console.log("decrypted(by Obj):", decrypted3);

      return keypair;
    });
    console.log('publicKey', publicKey, 'privateKey', privateKey);
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
