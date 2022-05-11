import { Component, ElementRef, Inject, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseReference, onValue, child, Unsubscribe } from "@angular/fire/database";

import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { RoutePaths, ErrorModal, GenericConst, MessageConst, NoUserModal } from 'src/app/types/enums';
import { ILocalUser, IMessage, IModal, IUser } from 'src/app/types/sauf.types';
import { UtilsService } from 'src/app/services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { environment } from 'src/environments/environment';
import { UuidService } from 'src/app/services/uuid.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnDestroy {

  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;

  readonly roomId: string = this._activatedroute.snapshot.params['roomId'];
  private allUsersHook: Unsubscribe;
  private allMsgsHook: Unsubscribe;
  localUser: ILocalUser = { id: '', name: '', associatedRoomId: '' }
  allConnectedUsers: IUser[] = [];
  allMessages: IMessage[] = [];
  aliasFormData: string = '';
  localUserSubs: Subscription;
  message: string = '';
  copyText: string = GenericConst.Copy;
  placeholderText: string = MessageConst.Placeholder;
  modalDismiss: boolean = false;
  isMsgPending: boolean = false;
  modalDetails: IModal = {
    title: '',
    message: '',
    show: false
  };

  constructor(
    @Inject(ActivatedRoute)
    private _activatedroute: ActivatedRoute,
    private _router: Router,
    private _utilsService: UtilsService,
    private _uuidService: UuidService,
    private _dbService: DbService
  ) {
    this.localUserSubs = this._utilsService.getAlias().subscribe((alias: ILocalUser) => {
      if (this._utilsService.isNullOrEmpty(alias.associatedRoomId)) {
        this._router.navigate([`/${RoutePaths.Home}`]);
      } else {
        this.localUser = { ...alias };
        this.aliasFormData = cloneDeep(alias.name);
      }
    });
    const dbRef: DatabaseReference = this._dbService.getDbRef();
    const userParams: string = `${environment.dbKey}/${this.roomId}/currentUsers`;
    this.allUsersHook = onValue(child(dbRef, userParams), (snapshot) => {
      const data = snapshot.val();
      if (!this._utilsService.isNullOrEmpty(data)) {
        this.allConnectedUsers = cloneDeep(data);
      } else {
        this.modalDetails = {
          title: NoUserModal.Title,
          message: NoUserModal.Message,
          show: true
        };
      }
    }, (error: Error) => {
      this.modalDetails = {
        title: ErrorModal.Title,
        message: ErrorModal.Message,
        show: true
      };
      console.error('error', error);
    });
    const msgParams: string = `${environment.dbKey}/${this.roomId}/messages`;
    this.allMsgsHook = onValue(child(dbRef, msgParams), (snapshot) => {
      const data = snapshot.val();
      if (!this._utilsService.isNullOrEmpty(data)) {
        this.allMessages = cloneDeep(data);
      }
    }, (error: Error) => {
      this.modalDetails = {
        title: ErrorModal.Title,
        message: ErrorModal.Message,
        show: true
      };
      console.error('error', error);
    });
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.roomId);
    this.copyText = GenericConst.Copied;
  }

  generateAlias(): void {
    this.localUser.name = this._utilsService.generateRandomAlias();
    this._utilsService.updateAlias(this.localUser);
  }

  updateAlias(): void {
    const prevName: string = this.localUser.name;
    this.localUser.name = cloneDeep(this.aliasFormData);
    this._utilsService.updateAlias(this.localUser);
    this.allConnectedUsers.filter((x: IUser) => x.id === this.localUser.id)[0].name = this.aliasFormData;
    this._dbService.updateUsers(this.roomId, this.allConnectedUsers)
      .catch((err: Error) => {
        this.modalDetails = {
          title: ErrorModal.Title,
          message: ErrorModal.Message,
          show: true
        };
        this.modalDismiss = true;
        this.localUser.name = prevName;
        this.aliasFormData = prevName;
        this._utilsService.updateAlias(this.localUser);
        console.error(err);
      });
  }

  sendMessage(): void {
    if (this.message.replace(/\n/g, '').length > 0) {
      this.isMsgPending = true;
      const msg: IMessage = {
        id: this._uuidService.generateUuid(),
        content: this.message,
        createdAt: new Date(),
        createdBy: this.localUser.id
      };
      this.allMessages.push(msg);
      this._dbService.updateMessages(this.roomId, this.allMessages)
        .then(() => {
          const elemRef: Element = this.chatContainer?.nativeElement;
          elemRef.getElementsByClassName('top')[0].scrollTo(0, elemRef.getElementsByClassName('top')[0].scrollHeight);
          setTimeout(() => {
            elemRef.getElementsByTagName('textarea')[0].focus();
          });
          this.message = '';
          this.isMsgPending = false;
        })
        .catch((err: Error) => {
          this.modalDetails = {
            title: ErrorModal.Title,
            message: ErrorModal.Message,
            show: true
          };
          this.modalDismiss = true;
          this.message = '';
          this.allMessages.pop();
          this.isMsgPending = false;
          console.error(err);
        });
    } else {
      this.message = '';
    }
  }

  onMouseEnter(): void {
    this.copyText = GenericConst.Copied;
  }

  closeModal(): void {
    this.modalDetails.show = false;
    if (this.modalDismiss) {
      this.modalDismiss = false;
    } else {
      this._router.navigate([`/${RoutePaths.Home}`]);
    }
  }

  ngOnDestroy(): void {
    this._utilsService.resetAlias();
    this.localUserSubs.unsubscribe();
    this.allUsersHook();
    this.allMsgsHook();
  }

}
