import { Injectable } from '@angular/core';
import { Database, DatabaseReference, DataSnapshot, get, ref, set, update, child } from "@angular/fire/database";
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { IChat, IMessage, IUser } from 'src/app/types/sauf.types';

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
   * Validates if the room exists
   * @param roomId - room id
   * @returns {Promise<DataSnapshot>}
   */
  validateRoomId(roomId: string): Promise<DataSnapshot> {
    const dbRef: DatabaseReference = this.getDbRef();
    return get(child(dbRef, `${environment.dbKey}/${roomId}`));
  }

  /**
   * Adds a new user to the room
   * @param roomId - room id
   * @param users - array of users
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