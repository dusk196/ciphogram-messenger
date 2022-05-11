import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {
  ciphertext: any;

  check() {
    window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        // Consider using a 4096-bit key for systems that require long-term security
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    ).then((keyPair) => {
      this.encryptMessage(keyPair.publicKey);

      setTimeout(() => {
        this.decryptMessage(keyPair.privateKey);
      }, 1000);
    });
    return 'lul';
  }

  async encryptMessage(key: any) {
    let encoded = this.getMessageEncoding();
    console.log('encoded', encoded);
    let ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encoded
    ).then((ciphertext) => {
      console.log('ciphertext', new TextDecoder().decode(ciphertext));
      this.ciphertext = ciphertext;
    });
  }

  async decryptMessage(key: any) {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      this.ciphertext
    );

    let dec = new TextDecoder();
    console.log('decrypted key', key);
    console.log('decrypted', decrypted);
    const d = dec.decode(decrypted);
    console.log(d);
  }


  getMessageEncoding() {
    const text = "পলিথিনের গিট না খুলে ছিড়ে ফেলিস, আর তোরা নাকি ব্র * খুলবি!🙂";
    const enc = new TextEncoder();
    const encodedText = enc.encode(text);
    return encodedText;
  }

}
