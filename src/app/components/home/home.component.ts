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
    private utilsService: UtilsService,
    private uuidService: UuidService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userDetails.id = this.uuidService.generateUuid();
    this.userDetails.associatedRoomId = this.uuidService.generateUuid();
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.userDetails.associatedRoomId);
    this.copyText = 'COPIED!';
    setTimeout(() => {
      this.copyText = 'COPY';
    }, 3000);
  }

  refreshId(): void {
    this.userDetails.associatedRoomId = this.uuidService.generateUuid();
  }

  checkRoomId(): void {
    if (this.userRoomId.length === 36) {
      this.isValidUserRoomId = this.uuidService.validateUuid(this.userRoomId);
    } else {
      this.isValidUserRoomId = false;
    }
  }

  jumpToRoom(): void {
    this.utilsService.updateAlias(this.userDetails.name);
    this.router.navigate(['/messages', this.userDetails.associatedRoomId]);
  }

  jumpToRoomId(): void {
    this.userDetails.associatedRoomId = this.userRoomId;
    this.utilsService.updateAlias(this.userDetails.name);
    this.router.navigate(['/messages', this.userRoomId]);
  }

  generateAlias(): void {
    this.userDetails.name = this.utilsService.generateRandomAlias();
  }

}
