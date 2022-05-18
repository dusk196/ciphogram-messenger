export enum RoutePaths {
  Home = 'home',
  Messages = 'messages',
  RoomId = 'roomId',
  Error = 'error'
}

export enum ErrorModal {
  Title = 'Oh crap! 😱',
  Message = 'We are facing some difficulties while connecting you to the server. 😒 Please try again.'
}

export enum NoRoomModal {
  Title = 'Oops! 😒',
  Message = 'We are unable to find that room. You sure you entered correct ID? 🙄 Please try again.'
}

export enum NoUserModal {
  Title = 'Oops! 😒',
  Message = 'We are unable to find any host connected to that room. You sure you entered correct ID? 🙄 Please try again or create a new room.'
}

export enum HowModal {
  Title = 'Wondering how? 😜',
  Message = `

  🔥 No session, no cookie, no tracking! 100% anonymous.

  ❤️‍🔥 No accounts required. Only real-time usage!

  🔐 Uses true end-to-end(E2EE) encryption for both 1 to 1 and group chats without taking any toll on performance… How ? By the power of both symmetrical(AES CBC) & asymmetrical encryption(RSA)!

  💾 No backend… Well, sort of! Thanks to Firebase’s real time database. How else it’d be this fast ? 😜

  💣💥 Your messages are self-destructive as soon as you leave the system!`
}

export enum MessageConst {
  Placeholder = 'Enter your messege... \nPress Enter to send, Ctrl + Enter OR Shift + Enter to add new line.\nHave fun! 😉\n\nOhh bdw, 2000 chars max. (free DB bruh) 😒',
  ProdPlaceholder = '\n\nALERT! Don\'t use Non-Prod mode to send sensitive messages! 😒 It\'s for testing purpose only. However, don\'t forget to check the console! 😎',
}

export enum GenericConst {
  Copy = 'Copy',
  Copied = 'Copied'
}
