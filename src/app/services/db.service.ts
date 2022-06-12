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

  /**
   * Creates a new room with a unique id
   * @param details - { roomId: string, message: string, user: IUser }
   * @returns {Promise<void>}
   */
  createRoom(details: IChat): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${details.associatedRoomId}`);
    return set(dbRef, details);
  }

  /**
   * Deletes the room with the provided unique id
   * @param roomId  - { roomId: string }
   * @returns {Promise<void>}
   */
  deleteRoom(roomId: string): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${roomId}`);
    return remove(dbRef);
  }

  /**
   * Validates if the room exists
   * @param roomId - room id
   * @returns {Promise<DataSnapshot>}
   */
  validateRoomId(roomId: string): Promise<DataSnapshot> {
    const dbRef: DatabaseReference = this.getDbRef();
    return get(child(dbRef, `${environment.dbKey}/${roomId}`));
  }

  /**
   * Increases the number of counter
   * @param counter - number to increase
   * @returns {Promise<void>}
   */
  updateCounter(counter: number): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}`);
    return update(dbRef, { totalMsgs: counter });
  }

  /**
   * Adds a new user to the room
   * @param roomId - room id
   * @param currentUsers - array of users
   * @returns {Promise<void>}
   */
  updateUsers(roomId: string, currentUsers: IUser[]): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${roomId}`);
    return update(dbRef, { currentUsers });
  }

  /**
   * Adds a new message to the room
   * @param roomId - room id
   * @param messages - array of messages
   * @returns {Promise<void>}
   */
  updateMessages(roomId: string, messages: IMessage[]): Promise<void> {
    const dbRef: DatabaseReference = this.getDbRef(`${environment.dbKey}/${roomId}`);
    return update(dbRef, { messages });
  }

  /**
   * Fetches the database reference
   * @param params - optional parameters (path to fetch the details from)
   * @returns {DatabaseReference}
   */
  getDbRef(params?: string): DatabaseReference {
    if (!this._utilsService.isNullOrEmpty(params)) {
      return ref(this._database, params);
    }
    return ref(this._database);
  }

}
