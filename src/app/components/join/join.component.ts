import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSnapshot } from '@angular/fire/database';
import { ILocalUser, IModal, IUser } from 'src/app/types/types';
import { RoutePaths, ErrorModal, Titles, ThemeColors, QuickJoinFailedModal } from 'src/app/types/enums';
import { UuidService } from 'src/app/services/uuid.service';
import { UtilsService } from 'src/app//services/utils.service';
import { DbService } from 'src/app/services/db.service';
import { CryptoService } from 'src/app/services/crypto.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html'
})

export class JoinComponent implements OnInit {

  private joinId: string;
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
    private readonly _route: ActivatedRoute,
    private readonly _cryptoService: CryptoService
  ) {
    this.joinId = this._route.snapshot.params[RoutePaths.JoinId] ?? '';
  }

  ngOnInit(): void {
    this._utilsService.setTitle(Titles.Join);
    this._utilsService.updateMeta(ThemeColors.Primary);
    this._dbService.getAllRooms()
      .then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const rooms = snapshot.val();
          console.log(rooms);
          const room: any = Object.values(rooms).filter((x: any) => x?.quickJoinId === this.joinId);
          console.log(room);
          if (room.length === 1) {
            this.userDetails.id = this._uuidService.generateUuid();
            this.userDetails.name = this._utilsService.generateRandomAlias();
            this.userDetails.associatedRoomId = room[0]?.associatedRoomId;
            this.userDetails.quickJoinId = room[0]?.quickJoinId;
            this._utilsService.updateAlias(this.userDetails);
            this._utilsService.updateAlias(this.userDetails);
            const users: IUser[] = room[0]?.currentUsers;
            users.push({
              id: this.userDetails.id,
              name: this.userDetails.name,
              publicKey: this._cryptoService.getRsaPublicKey()
            });
            this._dbService.updateUsers(room[0]?.associatedRoomId, users)
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
          } else {
            this.modalDetails = {
              title: QuickJoinFailedModal.Title,
              message: QuickJoinFailedModal.Message,
              show: true
            };
          }
        } else {
          this.modalDetails = {
            title: QuickJoinFailedModal.Title,
            message: QuickJoinFailedModal.Message,
            show: true
          };
        }
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

  closeModal(): void {
    this.modalDetails.show = false;
    this._router.navigate([`/home`]);
  }

}
