import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FirstNames, LastNames } from './../utils/utils';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private alias: Subject<string> = new Subject();

  updateAlias(newAlias: string): void {
    this.alias.next(newAlias);
  }

  generateRandomAlias(): string {
    const randomNumber1 = Math.floor(Math.random() * 1000);
    const randomNumber2 = Math.floor(Math.random() * 1000);
    return `${FirstNames[randomNumber1]} ${LastNames[randomNumber2]}`;
  }

}
