import { Injectable } from '@angular/core';
import { child, Database, DatabaseReference, DataSnapshot, get, ref, set, update } from "@angular/fire/database";
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

  createRoom(localUser: ILocalUser): Promise<void> {
    const user: IUser = {
      id: localUser.id,
      name: localUser.name
    };
    const details: IChat = this.initialInfo;
    details.associatedRoomId = localUser.associatedRoomId;
    details.currentUsers = [user];
    return set(ref(this._database, `${environment.dbKey}/${details.associatedRoomId}`), details);
  }

  validateRoomId(roomId: string): Promise<DataSnapshot> {
    const dbRef: DatabaseReference = ref(this._database);
    return get(child(dbRef, `${environment.dbKey}/${roomId}`));
  }

  addUserToRoom(roomId: string, users: IUser[]): Promise<void> {
    return update(ref(this._database, `${environment.dbKey}/${roomId}`), { currentUsers: users });
  }

}