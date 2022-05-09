import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILocalUser } from './../../types/sauf.types';
import { RoutePaths } from './../../types/routes.types';
import { UuidService } from './../../services/uuid.service';
import { UtilsService } from './../../services/utils.service';
import { DbService } from './../../services/db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  userDetails: ILocalUser = {
    id: '',
    name: '',
    associatedRoomId: ''
  };
  userRoomId: string = '';
  isValidUserRoomId: boolean = false;
  copyText: string = 'COPY';
  isLoading: boolean = false;
  showModal: boolean = false;

  constructor(
    private _utilsService: UtilsService,
    private _uuidService: UuidService,
    private _dbService: DbService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.userDetails.id = this._uuidService.generateUuid();
    this.userDetails.associatedRoomId = this._uuidService.generateUuid();
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.userDetails.associatedRoomId);
    this.copyText = 'COPIED!';
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
    this._dbService.createRoom(this.userDetails)
      .then(() => {
        this._router.navigate([`/${RoutePaths.Messages}`, this.userDetails.associatedRoomId]);
      })
      .catch((err: Error) => {
        this.showModal = true;
        this.isLoading = false;
        console.error(err);
      });

  }

  jumpToRoomId(): void {
    this.userDetails.associatedRoomId = this.userRoomId;
    this._utilsService.updateAlias(this.userDetails);
    this._router.navigate([`/${RoutePaths.Messages}`, this.userRoomId]);
  }

  generateAlias(): void {
    this.userDetails.name = this._utilsService.generateRandomAlias();
  }

  closeModal(): void {
    this.showModal = false;
  }

}
