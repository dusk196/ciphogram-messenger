import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { MessageConst } from 'src/app/types/enums';
import { ILocalUser } from 'src/app/types/sauf.types';
import { UtilsService } from 'src/app/services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { environment } from 'src/environments/environment';
import { DatabaseReference, onValue, child, Unsubscribe } from "@angular/fire/database";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit, OnDestroy {

  readonly roomId = this._activatedroute.snapshot.params['roomId'];
  private user: ILocalUser = { id: '', name: '', associatedRoomId: '' }
  private unsubscribe: Unsubscribe;
  allConnectedUsers: ILocalUser[] = [];
  aliasFormData: string = '';
  subscription: Subscription;
  message: string = '';
  copyText: string = 'COPY';
  placeholderText: string = MessageConst.Placeholder;

  constructor(
    @Inject(ActivatedRoute)
    private _activatedroute: ActivatedRoute,
    private _utilsService: UtilsService,
    private _dbService: DbService
  ) {
    this.subscription = this._utilsService.getAlias()
      .subscribe((alias: ILocalUser) => {
        if (!this._utilsService.isNullOrEmpty(alias)) {
          this.user = { ...alias };
          this.aliasFormData = cloneDeep(alias.name);
        }
      });
    const dbRef: DatabaseReference = this._dbService.getDbRef();
    const params: string = `${environment.dbKey}/${this._activatedroute.snapshot.params['roomId']}`;
    this.unsubscribe = onValue(child(dbRef, params), (snapshot) => {
      const data = snapshot.val();
      console.log('from compo data', data);
    }, (error: Error) => {
      console.log('error', error);
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
  }

  ngOnDestroy(): void {
    this._utilsService.resetAlias();
    this.subscription.unsubscribe();
  }

}
