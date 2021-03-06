import { Injectable } from '@angular/core';
import { Database, DatabaseReference, DataSnapshot, get, ref, set, update, remove, child } from "@angular/fire/database";
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { IChat, IMessage, IUser } from 'src/app/types/types';

@Injectable({
  providedIn: 'root'
})

export class DbService {

  constructor(private _database: Database, private _utilsService: UtilsService) { }

  createRoom(details: IChat): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${details.associatedRoomId}`);
    return set(dbRef, details);
  }

  deleteRoom(roomId: string): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${roomId}`);
    return remove(dbRef);
  }

  validateRoomId(roomId: string): Promise<DataSnapshot> {
    const dbRef: DatabaseReference = this.getDbRef();
    return get(child(dbRef, `${environment.dbKey}/${roomId}`));
  }

  getAllRooms(): Promise<DataSnapshot> {
    const dbRef: DatabaseReference = this.getDbRef();
    return get(child(dbRef, `${environment.dbKey}`));
  }

  updateCounter(counter: number): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}`);
    return update(dbRef, { totalMsgs: counter });
  }

  updateUsers(roomId: string, currentUsers: IUser[]): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${roomId}`);
    return update(dbRef, { currentUsers });
  }

  updateMessages(roomId: string, messages: IMessage[]): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${roomId}`);
    return update(dbRef, { messages });
  }

  getDbRef(params?: string): DatabaseReference {
    if (!this._utilsService.isNullOrEmpty(params)) {
      return ref(this._database, params);
    }
    return ref(this._database);
  }

}
