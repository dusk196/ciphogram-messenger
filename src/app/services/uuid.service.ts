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
   * Validates the given uuid whether it is valid or not
   * @param uuid
   * @returns {boolean}
   */
  validateUuid(uuid: string): boolean {
    return uuidValidate(uuid);
  }

}
