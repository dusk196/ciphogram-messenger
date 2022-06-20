import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { child, DatabaseReference, DataSnapshot, onValue, Unsubscribe } from '@angular/fire/database';
import { faUser, faPeopleRoof, faRotateRight, faPaste, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { IChat, ILocalUser, IModal, IUser } from 'src/app/types/types';
import { RoutePaths, ErrorModal, ErrorPaste, NoRoomModal, HowModal } from 'src/app/types/enums';

import { UuidService } from 'src/app/services/uuid.service';
import { UtilsService } from 'src/app//services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {

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
  }

  ngOnInit(): void {
    this.userDetails.id = this._uuidService.generateUuid();
    this.userDetails.name = this._utilsService.generateRandomAlias();
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
        this.modalDetails = {
          title: ErrorModal.Title,
          message: ErrorModal.Message,
          show: true
        };
        console.error(err);
      });
  }

}
