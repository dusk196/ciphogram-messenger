import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNull, isEmpty, isUndefined } from 'lodash';
import { FirstNames, LastNames } from '../utils/names';
import { ILocalUser } from '../types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private readonly initialAlias: ILocalUser = { id: '', name: '', associatedRoomId: '' };
  private alias$: BehaviorSubject<ILocalUser> = new BehaviorSubject(this.initialAlias);

  getAlias(): Observable<ILocalUser> {
    return this.alias$.asObservable();
  }

  updateAlias(newAlias: ILocalUser): void {
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
