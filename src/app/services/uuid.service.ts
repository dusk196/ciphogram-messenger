import { Injectable } from '@angular/core';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class UuidService {

  generateUuid(): string {
    return uuidv4();
  }

  validateUuid(uuid: string): boolean {
    return uuidValidate(uuid);
  }

}
