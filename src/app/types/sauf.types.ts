export interface IModal {
  title: string;
  message: string;
  show: boolean;
}

export interface ILocalUser {
  id: string;
  name: string;
  associatedRoomId: string;
}

export interface IUser {
  id: string;
  name: string;
  publicKey: string; // gonna keep private in local storage
}

export interface IMessage {
  id: string;
  intendedRecipientId: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface IChat {
  associatedRoomId: string;
  currentUsers: IUser[];
  messages: IMessage[];
}

export interface IRsaKeyPair {
  publicKey: string;
  privateKey: string;
}
