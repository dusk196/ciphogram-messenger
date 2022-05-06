import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './../../types/sauf.types';
import { UuidService } from './../../services/uuid.service';
import { UtilsService } from './../../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  userDetails: IUser = {
    id: '',
    name: '',
    associatedRoomId: ''
  };
  userRoomId: string = '';
  isValidUserRoomId: boolean = false;
  copyText: string = 'COPY';

  constructor(
    private _utilsService: UtilsService,
    private _uuidService: UuidService,
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
    this._utilsService.updateAlias(this.userDetails);
    this._router.navigate(['/messages', this.userDetails.associatedRoomId]);
  }

  jumpToRoomId(): void {
    this.userDetails.associatedRoomId = this.userRoomId;
    this._utilsService.updateAlias(this.userDetails);
    this._router.navigate(['/messages', this.userRoomId]);
  }

  generateAlias(): void {
    this.userDetails.name = this._utilsService.generateRandomAlias();
  }

}
