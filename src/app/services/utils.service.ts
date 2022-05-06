import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isNull, isEmpty, isUndefined } from 'lodash';
import { FirstNames, LastNames } from './../utils/utils';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private alias$: BehaviorSubject<string> = new BehaviorSubject('');

  getAlias() {
    return this.alias$.asObservable();
  }

  updateAlias(newAlias: string): void {
    this.alias$.next(newAlias);
  }

  destroyAlias(): void {
    this.alias$.complete();
  }

  isNullOrEmpty(value: any): boolean {
    return isNull(value) || isEmpty(value) || isUndefined(value);
  }

  generateRandomAlias(): string {
    const randomNumber1 = Math.floor(Math.random() * 1000);
    const randomNumber2 = Math.floor(Math.random() * 1000);
    return `${FirstNames[randomNumber1]} ${LastNames[randomNumber2]}`;
  }

}
