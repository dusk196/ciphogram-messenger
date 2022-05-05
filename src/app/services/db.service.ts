import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})

export class DbService {

  constructor(private database: Database) { }

  addMessage(message: string) {
    set(ref(this.database, 'messages/' + 'lol1'), {
      message
    });
  }

}
