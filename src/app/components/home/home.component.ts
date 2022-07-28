import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { child, DatabaseReference, DataSnapshot, onValue, Unsubscribe } from '@angular/fire/database';
import { faUser, faPeopleRoof, faRotateRight, faPaste, faCircleXmark, faHeart, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { IChat, ILocalUser, IModal, IUser } from 'src/app/types/types';
import { RoutePaths, ErrorModal, ErrorPaste, NoRoomModal, HowModal, WhatsProdMode, Titles, ThemeColors } from 'src/app/types/enums';

import { UuidService } from 'src/app/services/uuid.service';
import { UtilsService } from 'src/app//services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  private counterHook: Unsubscribe;
  readonly quickStart: string = `${window.location.origin}/${RoutePaths.Start}`;
  readonly headers: string[] = [
    'The private messenger!',
    'The 100% anonymous messenger!',
    'The untrackable messenger!',
    'The E2E encrypted messenger!',
    'The self-destructible messenger!',
    'The blazing fast messenger!'
  ];
  counter: number = 0;
  userRoomId: string = '';
  isValidUserRoomId: boolean = false;
  isLoading: boolean = false;
  isChecking: boolean = false;
  isProdMode: boolean = true;
  createRoom: boolean = true;
  isPasted: boolean = false;
  faUser: IconDefinition = faUser;
  faPeopleRoof: IconDefinition = faPeopleRoof;
  faRotateRight: IconDefinition = faRotateRight;
  faPaste: IconDefinition = faPaste;
  faCircleXmark: IconDefinition = faCircleXmark;
  faHeart: IconDefinition = faHeart;
  userDetails: ILocalUser = {
    id: '',
    name: '',
    associatedRoomId: '',
    quickJoinId: ''
  };
  modalDetails: IModal = {
    title: '',
    message: '',
    show: false
  };

  constructor(
    private readonly _utilsService: UtilsService,
    private readonly _uuidService: UuidService,
    private readonly _dbService: DbService,
    private readonly _router: Router,
    private readonly _cryptoService: CryptoService
  ) {
    this.userDetails.associatedRoomId = this._uuidService.generateUuid();
    this.userDetails.quickJoinId = this._uuidService.generateUuid();
    const dbRef: DatabaseReference = this._dbService.getDbRef();
    const counterParams: string = `${environment.dbKey}/totalMsgs`;
    this.counterHook = onValue(child(dbRef, counterParams), (snapshot) => {
      const data = snapshot.val();
      this.counter = data ? data : 0;
    }, (err: Error) => {
      console.error(err);
    });
  }

  ngOnInit(): void {
    this._utilsService.setTitle(Titles.Home);
    this._utilsService.updateMeta(ThemeColors.Primary);
    this.userDetails.id = this._uuidService.generateUuid();
  }

  ngAfterViewInit(): void {
    this._utilsService.scrollToTop();
  }

  toogleCreateRoom(value: boolean): void {
    this.createRoom = value;
  }

  clearRoomId(): void {
    this.userRoomId = '';
    this.isPasted = false;
    this.isValidUserRoomId = false;
  }

  whatsProdMode(): void {
    this.modalDetails = {
      title: WhatsProdMode.Title,
      message: WhatsProdMode.Message,
      show: true
    };
  }

  pasteRoomId(): void {
    this._utilsService.pasteFromClipboard()
      .then((data: string) => {
        this.isPasted = true;
        this.userRoomId = data.slice(0, 36);
        this.checkRoomId();
      })
      .catch((err: Error) => {
        console.error(err);
        this.modalDetails = {
          title: ErrorPaste.Title,
          message: ErrorPaste.Message,
          show: true
        };
      });
  }

  checkRoomId(): void {
    if (this.userRoomId.length === 36) {
      this.isValidUserRoomId = this._uuidService.validateUuid(this.userRoomId);
    } else if (this.userRoomId.length === 0) {
      this.isPasted = false;
      this.isValidUserRoomId = false;
    } else {
      this.isValidUserRoomId = false;
    }
  }

  jumpToRoom(): void {
    this.isLoading = true;
    this._utilsService.devConsoleLog('Generated Room ID:', this.userDetails.associatedRoomId);
    this._utilsService.updateAlias(this.userDetails);
    const user: IUser = {
      id: this.userDetails.id,
      name: this.userDetails.name,
      publicKey: this._cryptoService.getRsaPublicKey()
    };
    const details: IChat = {
      associatedRoomId: this.userDetails.associatedRoomId,
      quickJoinId: this.userDetails.quickJoinId,
      currentUsers: [user],
      messages: []
    };
    details.associatedRoomId = this.userDetails.associatedRoomId;
    details.currentUsers = [user];
    this._dbService.createRoom(details)
      .then(() => {
        this._router.navigate([`/${RoutePaths.Messages}`, this.userDetails.associatedRoomId]);
      })
      .catch((err: Error) => {
        this.isLoading = false;
        this.modalDetails = {
          title: ErrorModal.Title,
          message: ErrorModal.Message,
          show: true
        };
        console.error(err);
      });
  }

  jumpToRoomId(): void {
    this.isChecking = true;
    this._utilsService.devConsoleLog('Generated Room ID:', this.userDetails.associatedRoomId);
    this._dbService.validateRoomId(this.userRoomId)
      .then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          this.userDetails.associatedRoomId = this.userRoomId;
          this._utilsService.updateAlias(this.userDetails);
          const roomDetails: IChat = snapshot.val();
          const users: IUser[] = roomDetails.currentUsers;
          users.push({
            id: this.userDetails.id,
            name: this.userDetails.name,
            publicKey: this._cryptoService.getRsaPublicKey()
          });
          this._dbService.updateUsers(roomDetails.associatedRoomId, users)
            .then(() => {
              this._router.navigate([`/${RoutePaths.Messages}`, this.userDetails.associatedRoomId]);
            })
            .catch((err: Error) => {
              this.isChecking = false;
              this.modalDetails = {
                title: ErrorModal.Title,
                message: ErrorModal.Message,
                show: true
              };
              console.error(err);
            });
        } else {
          this.isChecking = false;
          this.modalDetails = {
            title: NoRoomModal.Title,
            message: NoRoomModal.Message,
            show: true
          };
          this.userRoomId = '';
          this.isValidUserRoomId = false;
        }
      })
      .catch((err: Error) => {
        this.isChecking = false;
        this.modalDetails = {
          title: ErrorModal.Title,
          message: ErrorModal.Message,
          show: true
        };
        console.error(err);
      });

  }

  generateAlias(): void {
    this.userDetails.name = this._utilsService.generateRandomAlias();
    this._utilsService.devConsoleLog('Generated alias ID: ', this.userDetails.id);
    this._utilsService.devConsoleLog('Generated alias: ', this.userDetails.name);
  }

  closeModal(): void {
    this.modalDetails.show = false;
  }

  showHow(): void {
    this.modalDetails = {
      title: HowModal.Title,
      message: HowModal.Message,
      show: true
    };
  }

  onModeChange(): void {
    this._utilsService.updateMode(this.isProdMode);
  }

  ngOnDestroy(): void {
    this.counterHook();
  }

}
