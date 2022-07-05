# CIPHOGRAM - when a Cipher meets an Anagram 🤪

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Bulma](https://img.shields.io/badge/Bulma-00D1B2?style=for-the-badge&logo=bulma&logoColor=white)](https://bulma.io/)

🤐 The 1st rule of CIPHOGRAM is you don't talk about CIPHOGRAM!

🤐 The 2nd rule of CIPHOGRAM is you DO NOT talk about CIPHOGRAM!

## An anonymous, untrackable, private, highly safe & secure yet a blazing fast messenger 😎

## [**DEMO**: https://ciphogram.web.app/](https://ciphogram.web.app/)

[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](http://perso.crans.org/besson/LICENSE.html)
[![Open Source? Yes!](https://img.shields.io/badge/Open_Source%3F-Yes!-blue?style=for-the-badge&logo=gitHub&logoColor=white)](https://opensource.com/resources/what-open-source/)
![Language](https://img.shields.io/github/languages/top/dusk196/ciphogram-messenger?style=for-the-badge)
![Size](https://img.shields.io/github/languages/code-size/dusk196/ciphogram-messenger?style=for-the-badge)

**_Note:_** _You need to configure the application with a new Firebase project. You can create a new Firebase Project in the Firebase Console (with hosting & Realtime Database) and use the official Firebase CLI tool to configure the application. Just run `npm i -g @angular/fire` (or NPX) and once it's done, run `ng add @angular/fire` and follow the steps in the terminal._

## Introduction

Have you ever felt not safe using big corporates messaging platform? Have you ever felt the need of safe & secure, 100% anonymous, untrackable & yet fast messenger with is truly end-to-end encrypted? I sure did! Personally, I take privacy very seriously. I don't even support using WhatsApp or even Google services; only because of my privacy concerns. Hence, the **CIPHOGRAM Messenger**!

## How is it different

🔥 No session, no cookie, no tracking! 100% anonymous.

💥 As obvious, no data stealing in the name of running advertisement (like other big corporations).

👤 No accounts required. Only real-time usage!

🔐 Uses true end-to-end (E2EE) encryption for both 1 to 1 and group chats without taking any toll on performance… How? By the power of both symmetrical (AES CBC) & asymmetrical encryption (RSA)!

💾 Thanks to Firebase’s real time database, it’s quite fast and everything is almost real-time even for the slowest connections.

💣 Your messages are self-destructible and are destroyed as soon as you either leave the system or lost the connection for a certain period of time.

## So, how the encryption works here in details (combination of symmetrical AES-CBC & asymmetrical RSA)

1. User gets a `RSA Key pair` that includes a `Public Key` & a super super super secret `Private Key`.

2. A random room is created/joined.

3. User (let's say A) shares his `Public Key` with other members (let's say B & C) of the room.

4. Now, if B needs to send any message to A, he will generate a random super secret `AES Key` and encrypt the plaintext message (let's call that `Cipher Text`).

5. Then B will encrypt the `AES Key` using A's `Public RSA Key` and share it along with `Cipher Text`. Note that, **Cipher Text can only be decrypted by that particular super secret AES Key**. And in RSA, **anything that's encrypted with a Public Key can only be decrypted by a Private Key of the same pair**.

6. Now, A will use his `Private Key` (_which is only in his system in real-time & never left it_) to get the super secret `AES Key`.

7. Once A gets the super secret `AES Key`, now he can finally use it to decrypt the `Cipher Text`.
