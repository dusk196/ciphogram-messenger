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
}

export interface IMessage {
    id: string;
    content: string;
    createdAt: Date;
    user: IUser;
}

export interface IChat {
    associatedRoomId: string;
    currentUsers: IUser[];
    messages: IMessage[];
}