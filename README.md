# CIPHOGRAM - when a Cipher meets an Anagram 🤪

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Bulma](https://img.shields.io/badge/Bulma-00D1B2?style=for-the-badge&logo=bulma&logoColor=white)](https://bulma.io/)

🤐 The 1st rule of CIPHOGRAM is you do not talk about CIPHOGRAM!

🤐 The 2nd rule of CIPHOGRAM is you DO NOT talk about CIPHOGRAM!

## [**Available LIVE at**: https://ciphogram.web.app/](https://ciphogram.web.app/)

[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](http://perso.crans.org/besson/LICENSE.html)
[![Open Source? Yes!](https://img.shields.io/badge/Open_Source%3F-Yes!-blue?style=for-the-badge&logo=gitHub&logoColor=white)](https://opensource.com/resources/what-open-source/)
![Language](https://img.shields.io/github/languages/top/dusk196/ciphogram-messenger?style=for-the-badge)
![Size](https://img.shields.io/github/languages/code-size/dusk196/ciphogram-messenger?style=for-the-badge)

## An anonymous, untrackable, private, highly safe & secure yet a blazing fast messenger 😎

**Q.** So, how to run it in local?

**A.** Well, it's an Angular application bruv. Just `npm i` and you're done like any other Angular application. To run in local use `ng serve -o` OR to deploy just use `ng deploy`! Cool? Ohh... You also need to setup Google Firebase first before you can actually play with it.

**_Note:_** _To run the application in local, you also need to configure the application with a new Firebase project. You can create a new Firebase Project (put any name; say **XYZGram**) at the [Firebase Console](https://console.firebase.google.com/) with hosting & Realtime Database. Also try to create a hosting and an app for this. It's optional NOW but saaves time later. Now, use the official Firebase CLI tool to configure the application as follows:_

* Run `npm i -g @angular/fire` (or `NPX`; whichever you prefer)
* Once done, login to your Firebase Account by `firebase login` in the terminal
* Done? Great! Now run `ng add @angular/fire` and follow the steps in the terminal.
* Once prompted, please select `ng deploy -- hosting` & `Realtime Database` from the options
* Then select your Firebase Project **XYZGram** or whichever you created
* Select a hosting site (please create, if already not created earlier)
* Select an app (please create, if already not created earlier)
* Now just wait & watch the magic of the CLI tool while it create and configure the application for you
* You also need to add a random UUID (well, I prefer UUIDs or GUIDs but you can put a STRING or even literally ANYTHING) at the `dbKey` field in the `environment.ts` & `environment.prod.ts` file. So, your realtime database name will be: `ciphogram-dev-{uuid}` or `ciphogram-prod-{uuid}`
* **Pro tip:** You can have custom permission set up just for `ciphogram-dev-{uuid}` or `ciphogram-prod-{uuid}` at the Realtime Database rules page so that any sniffer with your database URL can not misuse your DB. Keep the global read/write `false` and allow only for the designated connection using proper `uuid`. After all, it's just free quota most of us will use at the end of the day.

Still not done:

Now, hold your horses down. You're NOT done just yet! To prevent any kind of malicious uses, I have also enabled reCaptcha in this application. You can either disable the reCaptcha
`https://www.google.com/recaptcha/admin/`


**IMPORTANT:** It goes without saying but please don't commit all this secret info (`environment.ts` and `environment.prod.ts`) to any public repository!

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
