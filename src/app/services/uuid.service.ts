import { Injectable } from '@angular/core';
import { v4 as uuidv4, NIL as NIL_UUID, validate as uuidValidate } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class UuidService {

  constructor() { }

  readonly val = uuidv4();

  generateNullUuid(): string {
    return NIL_UUID;
  }

  generateUuid(): string {
    return uuidv4();
  }

  validateUuid(uuid: string): boolean {
    return uuidValidate(uuid);
  }

}
