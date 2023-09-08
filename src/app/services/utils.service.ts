import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNull, isEmpty, isUndefined } from 'lodash-es';
import { FirstNames, LastNames } from 'src/app/utils/names';
import { ILocalUser } from 'src/app/types/types';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  private readonly _document: Document = document;
  private readonly _window: Window = window;
  private readonly _navigator: Navigator = navigator;
  private readonly _localStorage: Storage = localStorage;
  private readonly initialAlias: ILocalUser = { id: '', name: '', associatedRoomId: '', quickJoinId: '' };
  private readonly alias$: BehaviorSubject<ILocalUser> = new BehaviorSubject(this.initialAlias);
  private readonly initialMode: boolean = true;
  private readonly prodMode$: BehaviorSubject<boolean> = new BehaviorSubject(this.initialMode);

  constructor(private meta: Meta, private title: Title) { }

  getAlias(): Observable<ILocalUser> {
    return this.alias$.asObservable();
  }

  getMode(): Observable<boolean> {
    return this.prodMode$.asObservable();
  }

  updateMode(mode: boolean): void {
    this.prodMode$.next(mode);
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
    const randomNumber1: number = Math.floor(Math.random() * 1000);
    const randomNumber2: number = Math.floor(Math.random() * 1000);
    return `${FirstNames[randomNumber1]} ${LastNames[randomNumber2]}`;
  }

  devConsoleLog(header: string, message: string): void {
    const headerStyle = 'color: red; font-size: 14px;';
    const msgStyle = 'font-size: 10px;';
    const mode = this.prodMode$.getValue();
    if (!mode) {
      console.log(`%c${header}`, headerStyle);
      console.log(`%c${message}`, msgStyle);
    }
  }

  pasteFromClipboard(): Promise<string> {
    return this._navigator.clipboard.readText();
  }

  share(data: object): void {
    this._navigator.share(data);
  }

  scrollToTop(): void {
    this._window.scrollTo(0, 0);
  }

  scrollToBottom(): void {
    this._window.scrollTo(0, this._document.body.scrollHeight);
  }

  setLocalStorageTheme(theme: string): void {
    this._localStorage.setItem('theme', theme);
  }

  setLocalStorageSound(sound: string): void {
    this._localStorage.setItem('sound', sound);
  }

  getLocalStorageTheme(): boolean {
    return this._localStorage.getItem('theme') === 'dark';
  }

  getLocalStorageSound(): boolean {
    return this._localStorage.getItem('sound') === 'mute';
  }

  setTitle(newTitle: string): void {
    this.title.setTitle(newTitle);
  }

  updateMeta(color: string): void {
    this.meta.updateTag({ name: 'theme-color', content: color }, 'name=\'theme-color\'');
  }

}
