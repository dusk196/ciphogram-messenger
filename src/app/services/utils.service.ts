import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNull, isEmpty, isUndefined } from 'lodash';
import { FirstNames, LastNames } from 'src/app/utils/names';
import { ILocalUser } from 'src/app/types/sauf.types';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private readonly initialAlias: ILocalUser = { id: '', name: '', associatedRoomId: '' };
  private alias$: BehaviorSubject<ILocalUser> = new BehaviorSubject(this.initialAlias);

  /**
   * Returns an observable that emits the alias
   * @returns {Observable<ILocalUser>}
   */
  getAlias(): Observable<ILocalUser> {
    return this.alias$.asObservable();
  }

  /**
   * Updates the alias with the given value
   * @param newAlias
   * @returns {void}
   */
  updateAlias(newAlias: ILocalUser): void {
    this.alias$.next(newAlias);
  }

  /**
   * Resets the alias to the initial value
   * @returns {void}
   */
  resetAlias(): void {
    this.updateAlias(this.initialAlias);
  }

  /**
   * Disposes the subscription to the alias observable
   * @returns {void}
   */
  destroyAlias(): void {
    this.alias$.complete();
  }

  /**
   * Checks if the given value is null or empty or undefined
   * @param value
   * @returns {boolean}
   */
  isNullOrEmpty(value: any): boolean {
    return isNull(value) || isEmpty(value) || isUndefined(value);
  }

  /**
   * Generates a random name
   * @returns {string}
   */
  generateRandomAlias(): string {
    const randomNumber1: number = Math.floor(Math.random() * 1000);
    const randomNumber2: number = Math.floor(Math.random() * 1000);
    return `${FirstNames[randomNumber1]} ${LastNames[randomNumber2]}`;
  }

}
