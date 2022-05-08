import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";
import { environment } from 'src/environments/environment';
import { IChat, ILocalUser, IUser } from '../types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class DbService {

  constructor(private _database: Database) { }

  private readonly initialInfo: IChat = {
    associatedRoomId: '',
    currentUsers: [],
    messages: []
  };

  createRoom(localUser: ILocalUser) {
    const user: IUser = {
      id: localUser.id,
      name: localUser.name
    };
    const details: IChat = this.initialInfo;
    details.associatedRoomId = localUser.associatedRoomId;
    details.currentUsers = [user];
    set(ref(this._database, environment.dbKey + '/' + details.associatedRoomId), details);
  }

  addMessage(message: string) {
    set(ref(this._database, 'messages/' + 'lol1'), {
      message
    });
  }

}
