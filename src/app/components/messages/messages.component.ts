import { Component, ChangeDetectorRef, ChangeDetectionStrategy, HostListener, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { DatabaseReference, onValue, child, Unsubscribe } from "@angular/fire/database";
import { faSun, faMoon, faPrint, faUser, faCopy, faRotateRight, faPeopleRoof, faLink, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { RoutePaths, ErrorModal, MessageConst, NoUserModal, Titles, ThemeColors } from 'src/app/types/enums';
import { ILocalUser, IMessage, IModal, IUser } from 'src/app/types/types';
import { UtilsService } from 'src/app/services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { environment } from 'src/environments/environment';
import { UuidService } from 'src/app/services/uuid.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { UserByIdPipe } from 'src/app/pipes/user-by-id.pipe';
import { DecryptMsgsPipe } from 'src/app/pipes/decrypt-msgs.pipe';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [UserByIdPipe, DecryptMsgsPipe],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class MessagesComponent implements OnInit, OnDestroy {

  private readonly sounds = { chat: new Audio('assets/chat.mp3') };
  private readonly _document: Document = document;
  private readonly _window: Window = window;
  readonly roomId: string = this._activatedroute.snapshot.params['roomId'];
  private allUsersHook: Unsubscribe;
  private allMsgsHook: Unsubscribe;
  private counterHook: Unsubscribe;
  private queue: Subject<string> = new Subject();
  localUser: ILocalUser = { id: '', name: '', associatedRoomId: '', quickJoinId: '' };
  allConnectedUsers: IUser[] = [];
  allMessages: IMessage[] = [];
  aliasFormData: string = '';
  localUserSubs: Subscription;
  quickJoin: string = '';
  message: string = '';
  messageSize: number = MessageConst.Size;
  messageLength: number = 0
  faSun: IconDefinition = faSun;
  faMoon: IconDefinition = faMoon;
  faPrint: IconDefinition = faPrint;
  faUser: IconDefinition = faUser;
  faCopy: IconDefinition = faCopy;
  faPeopleRoof: IconDefinition = faPeopleRoof;
  faRotateRight: IconDefinition = faRotateRight;
  faLink: IconDefinition = faLink;
  placeholderText: string = '';
  mobilePlaceholderText: string = '';
  modalDismiss: boolean = false;
  isProdMode: boolean = true;
  isDarkMode: boolean = false;
  isNavActive: boolean = false;
  showInfoModal: boolean = true;
  infoModalType: string = 'room';
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
    // private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _utilsService: UtilsService,
    private readonly _uuidService: UuidService,
    private readonly _dbService: DbService,
    private readonly _cryptoService: CryptoService,
    private readonly _userByIdPipe: UserByIdPipe,
    private readonly _decryptMsgsPipe: DecryptMsgsPipe
  ) {
    this._utilsService.getMode()
      .pipe(takeUntil(this.unsubscibe$))
      .subscribe((mode: boolean) => {
        this.isProdMode = mode;
        this.placeholderText = this.isProdMode ? MessageConst.Placeholder : MessageConst.Placeholder + MessageConst.ProdPlaceholder;
        this.mobilePlaceholderText = this.isProdMode ? MessageConst.MobilePlaceholder : MessageConst.MobilePlaceholder + MessageConst.ProdPlaceholder;
      });
    this.localUserSubs = this._utilsService.getAlias()
      .subscribe((alias: ILocalUser) => {
        if (this._utilsService.isNullOrEmpty(alias.associatedRoomId)) {
          this._router.navigate([`/${RoutePaths.Home}`]);
        } else {
          this.quickJoin = `${window.location.origin}/${RoutePaths.Join}/${alias.quickJoinId}`;
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
        this.sounds.chat.play();
      }
    }, (err: Error) => {
      this.modalDetails = {
        title: ErrorModal.Title,
        message: ErrorModal.Message,
        show: true
      };
      console.error(err);
    });
    this.queue.pipe(takeUntil(this.unsubscibe$)).subscribe((msg: string) => {
      this.sendMessage(msg);
    });
  }

  ngOnInit(): void {
    this._utilsService.setTitle(Titles.Room);
    this.isDarkMode = this._utilsService.getLocalStorageTheme();
    this._utilsService.updateMeta(this.isDarkMode ? ThemeColors.Dark : ThemeColors.Light);
    this.messageLength = this.messageSize - this.message.length;
  }

  onCopyId(): void {
    navigator.clipboard.writeText(this.roomId);
  }

  onCopyLink(): void {
    navigator.clipboard.writeText(this.quickJoin);
  }

  updateInfoModal(type: string): void {
    this.aliasFormData = this.localUser.name;
    this.infoModalType = type;
    this.showInfoModal = true;
    this.isNavActive = false;
  }

  onExit(): void {
    this.infoModalType = 'leave'
    this.showInfoModal = true;
  }

  onPrint(): void {
    const element: HTMLElement = this._document.createElement('h2');
    element.textContent = `Report generated on ${formatDate(new Date(), 'h:mm a, dd/MM/yyyy', 'en-IN')} (IST) by ${this.localUser.name}`;
    element.setAttribute('style', 'margin-bottom: 30px;');
    const participants: HTMLElement = this._document.createElement('h3');
    participants.textContent = `Participants (as per alias):`;
    const allUsers: HTMLElement = this.getAllParticipants();
    const chatHeader: HTMLElement = this._document.createElement('h3');
    const chats: HTMLElement = this.getAllMessages();
    if (this.allMessages.length > 0) {
      chatHeader.textContent = `Discussions:`;
      allUsers.setAttribute('style', 'margin-bottom: 30px;');
      chats.setAttribute('style', 'margin-bottom: 50px;');
    } else {
      allUsers.setAttribute('style', 'margin-bottom: 50px;');
    }
    const footer: HTMLElement = this._document.createElement('div');
    footer.innerHTML = `<hr /><p>Generated using <a rel = "noopener" href="${this._document.location.origin}" target = "_blank"><strong>CIPHOGRAM</strong></a> - the privacy messenger!</p><p>Made with ❤️ by <strong>Sayantan Roy</strong>. Source code: <a rel = "noopener" href="https://github.com/dusk196/ciphogram-messenger" target = "_blank">GitHub</a></p>`;
    const printWindow: Window | null = this._window.open();
    printWindow?.document.body.setAttribute('style', 'font-family: monospace;');
    printWindow?.document.body.appendChild(element);
    printWindow?.document.body.appendChild(participants);
    printWindow?.document.body.appendChild(allUsers);
    printWindow?.document.body.appendChild(chatHeader);
    printWindow?.document.body.appendChild(chats);
    printWindow?.document.body.appendChild(footer);
    printWindow?.document.close();
    printWindow?.print();
    printWindow?.close();
  }

  getAllParticipants(): HTMLElement {
    const allUserElement: HTMLElement = this._document.createElement('p');
    const allUser: string[] = this.allConnectedUsers.map((user: IUser) => user.name);
    allUserElement.textContent = allUser.join(', ');
    return allUserElement;
  }

  getAllMessages(): HTMLElement {
    const allMsgElement: HTMLElement = this._document.createElement('div');
    this.allMessages.forEach((msg: IMessage) => {
      if (msg.intendedRecipientId === this.localUser.id) {
        const msgElement: HTMLElement = this._document.createElement('p');
        const timeElement: HTMLElement = this._document.createElement('span');
        timeElement.textContent = `[${formatDate(msg.createdAt, 'dd-MM-yyyy, h:mm a', 'en-IN')}] `;
        const nameElement: HTMLElement = this._document.createElement('strong');
        nameElement.textContent = this._userByIdPipe.transform(msg.createdBy, this.allConnectedUsers);
        const chatElement: HTMLElement = this._document.createElement('span');
        chatElement.textContent = `: ${this._decryptMsgsPipe.transform(msg.secretMessage)}`;
        msgElement.appendChild(timeElement);
        msgElement.appendChild(nameElement);
        msgElement.appendChild(chatElement);
        allMsgElement.appendChild(msgElement);
      }
    });
    return allMsgElement;
  }

  generateAlias(): void {
    this.aliasFormData = this._utilsService.generateRandomAlias();
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
      })
      .finally(() => {
        this.showInfoModal = false;
      });
  }

  checkMessage(): void {
    this.messageLength = this.messageSize - this.message.length;
  }

  queueMessage(): void {
    const localMsg = cloneDeep(this.message);
    this.message = '';
    this.checkMessage();
    if (localMsg.replace(/\n/g, '').length > 0 && localMsg.length <= this.messageSize) {
      setTimeout(() => {
      this.queue.next(localMsg);
      });
    }
  }

  sendMessage(message: string): void {
    this.allConnectedUsers.forEach((user: IUser) => {
      const msg: IMessage = {
        id: this._uuidService.generateUuid(),
        secretMessage: this._cryptoService.encryptDataByAes(encodeURIComponent(message), user.publicKey),
        createdAt: new Date(),
        createdBy: this.localUser.id,
        intendedRecipientId: user.id
      };
      this.allMessages.push(msg);
    });
    this._dbService.updateCounter(this.counter + 1);
    this._dbService.updateMessages(this.roomId, this.allMessages)
      .then(() => {
        this._utilsService.scrollToBottom();
      })
      .catch((err: Error) => {
        this.message += message;
        this.modalDetails = {
          title: ErrorModal.Title,
          message: ErrorModal.Message,
          show: true
        };
        this.modalDismiss = true;
        this.allMessages.pop();
        console.error(err);
      })
  }

  share(): void {
    const shareData = {
      title: 'CIPHOGRAM - the private messenger!',
      text: `${this.localUser.name} invited you to join a 100% E2E encrypted conversation. Join now!`,
      url: this.quickJoin
    };
    this._utilsService.share(shareData);
  }

  changeTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this._utilsService.setLocalStorageTheme(this.isDarkMode ? 'dark' : 'light');
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }

  closeModal(): void {
    this.modalDetails.show = false;
    if (this.modalDismiss) {
      this.modalDismiss = false;
    } else {
      this._router.navigate([`/${RoutePaths.Home}`]);
    }
  }

  toggleNavMenu() {
    this.isNavActive = !this.isNavActive;
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
