import { Injectable } from '@angular/core';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class UuidService {

  /**
   * Generates a new random uuid
   * @returns {string}
   */
  generateUuid(): string {
    return uuidv4();
  }

  /**
   * 
   * @param uuid - uuid to validate whether it is valid or not
   * @returns {boolean}
   */
  validateUuid(uuid: string): boolean {
    return uuidValidate(uuid);
  }

}
