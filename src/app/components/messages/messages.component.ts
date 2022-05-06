import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { IUser } from './../../types/sauf.types';
import { UtilsService } from './../../services/utils.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit, OnDestroy {

  readonly roomId = this._activatedroute.snapshot.params['roomId'];
  private user: IUser = {
    id: '',
    name: '',
    associatedRoomId: ''
  }
  aliasFormData: string = '';
  subscription: Subscription = new Subscription();


  constructor(
    @Inject(ActivatedRoute)
    private _activatedroute: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    this.subscription = this.utilsService.getAlias().subscribe((alias: IUser) => {
      console.log(alias)
      if (!this.utilsService.isNullOrEmpty(alias)) {
        this.user = { ...alias };
        console.log(this.user);
        this.aliasFormData = cloneDeep(alias.name);
      }
    });
  }

  ngOnInit(): void {
    console.log(this._activatedroute.snapshot.params['roomId']);
  }

  generateAlias(): void {
    this.user.name = this.utilsService.generateRandomAlias();
    this.utilsService.updateAlias(this.user);
  }

  updateAlias(): void {
    this.user.name = cloneDeep(this.aliasFormData);
    this.utilsService.updateAlias(this.user);
  }

  ngOnDestroy(): void {
    this.utilsService.resetAlias();
    this.subscription.unsubscribe();
  }

}
