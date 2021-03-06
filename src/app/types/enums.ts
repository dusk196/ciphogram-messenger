export enum RoutePaths {
  Home = 'home',
  Messages = 'room',
  Start = 'start',
  Join = 'connect',
  JoinId = 'joinId',
  RoomId = 'roomId',
  Error = 'error'
}

export enum ErrorModal {
  Title = 'Oh crap! π±',
  Message = 'We are facing some difficulties while connecting you to the server. π Please try again.'
}

export enum ErrorPaste {
  Title = 'Oh crap! π±',
  Message = 'It seems like your browser is preventing us from accessing the clipboard. π Please allow it from the settings & try again.'
}

export enum NoRoomModal {
  Title = 'Oops! π',
  Message = 'We are unable to find that room. You sure you entered correct ID? π Please try again.'
}

export enum QuickJoinFailedModal {
  Title = 'Oops! π',
  Message = 'We are unable to find that room. You sure you have the correct & unexpired link? π\n\nPlease try again either with the Room ID or with the correct link. Also, you can ask the sender to send it again.'
}

export enum NoUserModal {
  Title = 'Oops! π',
  Message = 'We are unable to find any host connected to that room. You sure you entered correct ID? π Please try again or create a new room.'
}

export enum WhatsProdMode {
  Title = 'So... Production mode π₯',
  Message = `I started this applcation as a proof of concept (POC). I was not sure if it\'d be a good idea to make it available for everyone apart from devs. π€\n\nIf you are a developer and checking how this works in real-time, you can uncheck this option & keep an eye in the console for informative logs. π€\n\nFor regular users, I recommend to keep the production mode checked for enhanced security. π`
}

export enum HowModal {
  Title = 'Wondering how? β€οΈβπ₯',
  Message = `π₯ No session, no cookie, no tracking! 100% anonymous.\n\nπ€ No accounts required. Only real-time usage!\n\nπ Uses true end-to-end encryption (E2EE) for both 1 to 1 and group chats without taking any toll on performanceβ¦ How? By the power of both symmetrical (AES CBC) & asymmetrical encryption (RSA)!\n\nπΎ Thanks to Firebaseβs real time database, itβs quite fast and everything is almost real-time even for the slowest connections.\n\nπ£π₯ Your messages are self-destructible & destroyed as soon as you leave the system! No need to worry about traces.`
}

export enum MessageConst {
  Size = 2000,
  MobilePlaceholder = 'Enter your messege...',
  Placeholder = 'Enter your messege... \nPress Enter to send, <Ctrl + Enter> OR <Shift + Enter> to add new line. ',
  ProdPlaceholder = '\n\nALERT! Don\'t use Non-Prod mode to send sensitive messages. It\'s for testing purpose only. However, don\'t forget to check the console for informative logs.',
}

export enum Titles {
  Error = '404! Page not found! π',
  Home = 'CIPHOGRAM - when a Cipher meets an Anagram π€ͺ',
  Room = 'CIPHOGRAM - Online 1',
  Join = 'Connecting, please wait...'
}

export enum ThemeColors {
  Primary = '#8A4D76',
  Light = '#F5F5F5',
  Dark = '#363636'
}
