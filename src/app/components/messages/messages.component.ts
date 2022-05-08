import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ILocalUser } from './../../types/sauf.types';
import { UtilsService } from './../../services/utils.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit, OnDestroy {

  readonly roomId = this._activatedroute.snapshot.params['roomId'];
  private user: ILocalUser = {
    id: '',
    name: '',
    associatedRoomId: ''
  }
  aliasFormData: string = '';
  subscription: Subscription = new Subscription();
  message: string = '';
  copyText: string = 'COPY';
  placeholderText: string = 'Enter your messege... \nPress Enter to send, Ctrl + Enter OR Shift + Enter to add new line.\nHave fun!';

  constructor(
    @Inject(ActivatedRoute)
    private _activatedroute: ActivatedRoute,
    private _utilsService: UtilsService
  ) {
    this.subscription = this._utilsService.getAlias().subscribe((alias: ILocalUser) => {
      if (!this._utilsService.isNullOrEmpty(alias)) {
        this.user = { ...alias };
        this.aliasFormData = cloneDeep(alias.name);
      }
    });
  }

  ngOnInit(): void {
    console.log('roomId', this._activatedroute.snapshot.params['roomId']);
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.roomId);
    this.copyText = 'COPIED!';
  }

  generateAlias(): void {
    this.user.name = this._utilsService.generateRandomAlias();
    this._utilsService.updateAlias(this.user);
  }

  updateAlias(): void {
    this.user.name = cloneDeep(this.aliasFormData);
    this._utilsService.updateAlias(this.user);
  }

  sendMessage(): void {
    console.log(this.message);
    // this.utilsService.sendMessage(this.message, this.user.associatedRoomId);
    // this.message = '';
  }

  ngOnDestroy(): void {
    this._utilsService.resetAlias();
    this.subscription.unsubscribe();
  }

}
