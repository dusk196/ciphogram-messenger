# MAZE - be amazed! 😎

## The  safe & secure, 100% anonymous, untrackable & still quite fast messenger made for privacy enthusiasts

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Angular Material](https://img.shields.io/badge/Angular_Material-3f51b5?style=for-the-badge&logo=angular&logoColor=white)](https://material.angular.io/)

🤐 The 1st rule about MAZE is you don't talk about MAZE!

* The 2nd rule about MAZE is you don't talk about MAZE!

[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](http://perso.crans.org/besson/LICENSE.html)
[![Open Source? Yes!](https://img.shields.io/badge/Open_Source%3F-Yes!-blue?style=for-the-badge&logo=gitHub&logoColor=white)](https://opensource.com/resources/what-open-source/)
![Language](https://img.shields.io/github/languages/top/dusk196/maze-messenger?style=for-the-badge)
![Size](https://img.shields.io/github/languages/code-size/dusk196/maze-messenger?style=for-the-badge)

## Safe & Secure, Anonymous, Untrackable and Fast

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.4.

[**DEMO**: https://sauf-messenger.web.app/](https://sauf-messenger.web.app/)

## Introduction

Have you ever felt the need of safe & secure, 100% anonymous, untrackable & still quite fast messenger? I sure did! Personally, I take privacy very seriously. I don't even support using WhatsApp or even Google services; only because of my privacy concerns. Hence, the **MAZE Messenger**!

## How it is different?

* No session, no cookie, no tracking! 100% anonymous.

* No accounts required. Only real-time usage!

* Uses true end-to-end (E2EE) encryption for both 1 to 1 and group chats without taking any toll on performance… How ? By the power of both symmetrical (AES CBC) & asymmetrical encryption (RSA)!

* No backend… Well, sort of! Thanks to Firebase’s real time database. How else it’d be this fast?

* Your messages are self-destructive as soon as you leave the system. C'mon, afterall it's the free tier of Firebase! :P

## How the encryption works here in details (combination of symmetrical AES-CBC & asymmetrical RSA)

1. User gets a `RSA Key pair` that includes a `Public Key` & a super super super secret `Private Key`.

2. A random room is created/joined.

3. User (let's say A) shares his `Public Key` with other members (let's say B & C) of the room.

4. Now, if B needs to send any message to A, he will generate a random super secret `AES Key` and encrypt the plaintext message (let's call that `Cipher Text`).

5. Then B will encrypt the `AES Key` using A's `Public RSA Key` and share it along with `Cipher Text`. Note that, **Cipher Text can only be decrypted by that particular super secret AES Key**. And in RSA, **anything that's encrypted with a Public Key can only be decrypted by a Private Key of the same pair**.

6. Now, A will use his `Private Key` (_which is only in his system in real time & never left it_) to get the super secret `AES Key`.

7. Once A gets the super secret `AES Key`, now he can finally use it to decrypt the `Cipher Text`.
