import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isNull, isEmpty, isUndefined } from 'lodash';
import { FirstNames, LastNames } from './../utils/utils';
import { IUser } from '../types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private readonly initialAlias: IUser = { id: '', name: '', associatedRoomId: '' };
  private alias$: BehaviorSubject<IUser> = new BehaviorSubject(this.initialAlias);

  getAlias() {
    return this.alias$.asObservable();
  }

  updateAlias(newAlias: IUser): void {
    this.alias$.next(newAlias);
  }

  resetAlias(): void {
    this.updateAlias(this.initialAlias);
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
