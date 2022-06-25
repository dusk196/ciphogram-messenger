export interface IModal {
  title: string;
  message: string;
  show: boolean;
}

export interface IInfoModal {
  type: string;
  isDarkMode: boolean;
  show: boolean;
}

export interface ILocalUser {
  id: string;
  name: string;
  associatedRoomId: string;
  quickJoinId: string;
}

export interface IUser {
  id: string;
  name: string;
  publicKey: string;
}

export interface IMessage {
  id: string;
  intendedRecipientId: string;
  secretMessage: string;
  createdAt: Date;
  createdBy: string;
}

export interface IChat {
  associatedRoomId: string;
  quickJoinId: string;
  currentUsers: IUser[];
  messages: IMessage[];
}

export interface IRsaKeyPair {
  publicKey: string;
  privateKey: string;
}
