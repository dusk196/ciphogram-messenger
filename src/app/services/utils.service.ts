import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNull, isEmpty, isUndefined } from 'lodash';
import { FirstNames, LastNames } from 'src/app/utils/names';
import { ILocalUser } from 'src/app/types/types';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private readonly initialAlias: ILocalUser = { id: '', name: '', associatedRoomId: '' };
  private readonly alias$: BehaviorSubject<ILocalUser> = new BehaviorSubject(this.initialAlias);
  private readonly initialMode: boolean = true;
  private readonly prodMode$: BehaviorSubject<boolean> = new BehaviorSubject(this.initialMode);

  /**
   * Returns an observable that emits the alias
   * @returns {Observable<ILocalUser>}
   */
  getAlias(): Observable<ILocalUser> {
    return this.alias$.asObservable();
  }

  /**
   * Returns an observable that emits the mode (Dev or Prod)
   * @returns {Observable<boolean>}
   */
  getMode(): Observable<boolean> {
    return this.prodMode$.asObservable();
  }

  /**
   * Updates the mode with the given value
   * @param mode  The operation mode `boolean` (Dev or Prod)
   * @returns {void}
   */
  updateMode(mode: boolean): void {
    this.prodMode$.next(mode);
  }

  /**
   * Updates the alias with the given value
   * @param newAlias The new alias of `ILocalUser` to be updated
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
   * @param value The value to be checked
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

  /**
   * A function that prints the given message to the console based on the mode (Dev or Prod)
   * @param message The message to be displayed in the console
   */
  devConsoleLog(header: string, message: string): void {
    const headerStyle = 'color: red; font-size: 14px;';
    const msgStyle = 'font-size: 10px;';
    const mode = this.prodMode$.getValue();
    if (!mode) {
      console.log(`%c${header}`, headerStyle);
      console.log(`%c${message}`, msgStyle);
    }
  }

}
