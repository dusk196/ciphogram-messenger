import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSnapshot } from '@angular/fire/database';

import { IChat, ILocalUser, IModal, IUser } from 'src/app/types/sauf.types';
import { RoutePaths, ErrorModal, NoRoomModal, GenericConst } from 'src/app/types/enums';

import { UuidService } from 'src/app/services/uuid.service';
import { UtilsService } from 'src/app//services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { CryptoService } from 'src/app/services/crypto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  private readonly initialInfo: IChat = {
    associatedRoomId: '',
    currentUsers: [],
    messages: []
  };
  userRoomId: string = '';
  isValidUserRoomId: boolean = false;
  copyText: string = GenericConst.Copy;
  isLoading: boolean = false;
  isChecking: boolean = false;
  userDetails: ILocalUser = {
    id: '',
    name: '',
    associatedRoomId: ''
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
  ) { }

  ngOnInit(): void {
    this.userDetails.id = this._uuidService.generateUuid();
    this.userDetails.associatedRoomId = this._uuidService.generateUuid();
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.userDetails.associatedRoomId);
    this.copyText = GenericConst.Copied;
  }

  refreshId(): void {
    this.userDetails.associatedRoomId = this._uuidService.generateUuid();
  }

  checkRoomId(): void {
    if (this.userRoomId.length === 36) {
      this.isValidUserRoomId = this._uuidService.validateUuid(this.userRoomId);
    } else {
      this.isValidUserRoomId = false;
    }
  }

  jumpToRoom(): void {
    this.isLoading = true;
    this._utilsService.updateAlias(this.userDetails);
    const user: IUser = {
      id: this.userDetails.id,
      name: this.userDetails.name,
      publicKey: this._cryptoService.getRsaPublicKey()
    };
    const details: IChat = {
      associatedRoomId: this.userDetails.associatedRoomId,
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
  }

  onMouseEnter(): void {
    this.copyText = GenericConst.Copy;
  }

  closeModal(): void {
    this.modalDetails.show = false;
  }

}
