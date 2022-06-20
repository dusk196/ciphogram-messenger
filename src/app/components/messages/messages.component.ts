import { Component, ElementRef, HostListener, Inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseReference, onValue, child, Unsubscribe } from "@angular/fire/database";

import { Subject, Subscription, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';

import { RoutePaths, ErrorModal, GenericConst, MessageConst, NoUserModal } from 'src/app/types/enums';
import { ILocalUser, IMessage, IModal, IUser } from 'src/app/types/types';
import { UtilsService } from 'src/app/services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { environment } from 'src/environments/environment';
import { UuidService } from 'src/app/services/uuid.service';
import { CryptoService } from 'src/app/services/crypto.service';

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
  private counterHook: Unsubscribe;
  localUser: ILocalUser = { id: '', name: '', associatedRoomId: '', quickJoinId: '' };
  allConnectedUsers: IUser[] = [];
  allMessages: IMessage[] = [];
  aliasFormData: string = '';
  localUserSubs: Subscription;
  message: string = '';
  copyText: string = GenericConst.Copied;
  placeholderText: string = '';
  modalDismiss: boolean = false;
  isEncrypted: boolean = false;
  isProdMode: boolean = true;
  counter: number = 0;
  unsubscibe$: any = new Subject();
  modalDetails: IModal = {
    title: '',
    message: '',
    show: false
  };

  constructor(
    @Inject(ActivatedRoute)
    private readonly _activatedroute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _utilsService: UtilsService,
    private readonly _uuidService: UuidService,
    private readonly _dbService: DbService,
    private readonly _cryptoService: CryptoService
  ) {
    this._utilsService.getMode()
      .pipe(takeUntil(this.unsubscibe$))
      .subscribe((mode: boolean) => {
        this.isProdMode = mode;
        this.placeholderText = this.isProdMode ? MessageConst.Placeholder : MessageConst.Placeholder + MessageConst.ProdPlaceholder;
      });
    this.localUserSubs = this._utilsService.getAlias()
      .subscribe((alias: ILocalUser) => {
        if (this._utilsService.isNullOrEmpty(alias.associatedRoomId)) {
          this._router.navigate([`/${RoutePaths.Home}`]);
        } else {
          this.localUser = { ...alias };
          this.aliasFormData = cloneDeep(alias.name);
        }
      });
    const dbRef: DatabaseReference = this._dbService.getDbRef();
    const counterParams: string = `${environment.dbKey}/totalMsgs`;
    this.counterHook = onValue(child(dbRef, counterParams), (snapshot) => {
      const data = snapshot.val();
      this.counter = data ? data : 0;
    }, (err: Error) => {
      console.error(err);
    });
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
    }, (err: Error) => {
      this.modalDetails = {
        title: ErrorModal.Title,
        message: ErrorModal.Message,
        show: true
      };
      console.error(err);
    });
    const msgParams: string = `${environment.dbKey}/${this.roomId}/messages`;
    this.allMsgsHook = onValue(child(dbRef, msgParams), (snapshot) => {
      const data = snapshot.val();
      if (!this._utilsService.isNullOrEmpty(data)) {
        this.allMessages = cloneDeep(data);
        setTimeout(() => {
          const elemRef: Element = this.chatContainer?.nativeElement;
          elemRef.getElementsByClassName('top')[0].scrollTo(0, elemRef.getElementsByClassName('top')[0].scrollHeight);
        });
      }
    }, (err: Error) => {
      this.modalDetails = {
        title: ErrorModal.Title,
        message: ErrorModal.Message,
        show: true
      };
      console.error(err);
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
    const localMsg = cloneDeep(this.message);
    this.message = '';
    if (localMsg.replace(/\n/g, '').length > 0 && localMsg.length <= 2000) {
      this.allConnectedUsers.forEach((user: IUser) => {
        const msg: IMessage = {
          id: this._uuidService.generateUuid(),
          secretMessage: this._cryptoService.encryptDataByAes(localMsg, user.publicKey),
          createdAt: new Date(),
          createdBy: this.localUser.id,
          intendedRecipientId: user.id
        };
        this.allMessages.push(msg);
      });
      this._dbService.updateCounter(this.counter + 1);
      this._dbService.updateMessages(this.roomId, this.allMessages)
        .then(() => {
          const elemRef: Element = this.chatContainer?.nativeElement;
          elemRef.getElementsByClassName('top')[0].scrollTo(0, elemRef.getElementsByClassName('top')[0].scrollHeight);
          setTimeout(() => {
            elemRef.getElementsByTagName('textarea')[0].focus();
          });
        })
        .catch((err: Error) => {
          this.modalDetails = {
            title: ErrorModal.Title,
            message: ErrorModal.Message,
            show: true
          };
          this.modalDismiss = true;
          this.allMessages.pop();
          console.error(err);
        });
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
    this.allConnectedUsers.filter((x: IUser, index: number) => {
      if (x.id === this.localUser.id) {
        this.allConnectedUsers.splice(index, 1);
        if (this.allConnectedUsers.length === 0) {
          this._dbService.deleteRoom(this.roomId);
        } else {
          this._dbService.updateUsers(this.roomId, this.allConnectedUsers);
        }
      }
    });
    this._utilsService.resetAlias();
    this.localUserSubs.unsubscribe();
    this.allUsersHook();
    this.allMsgsHook();
    this.counterHook();
    this.unsubscibe$.next();
    this.unsubscibe$.complete();
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.ngOnDestroy();
    return;
  }

}
