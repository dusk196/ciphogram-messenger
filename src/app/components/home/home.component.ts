import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UuidService } from './../../services/uuid.service';
import { UtilsService } from './../../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  newRoomId: string = '';
  localAlias: string = '';
  userRoomId: string = '';
  isValidUserRoomId: boolean = false;
  copyText: string = 'COPY';

  constructor(
    private utilsService: UtilsService,
    private uuidService: UuidService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newRoomId = this.uuidService.generateUuid();
    console.log(this.uuidService.generateUuid());
    console.log(this.uuidService.val);
    console.log(this.uuidService.val);
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.newRoomId);
    this.copyText = 'COPIED!';
    setTimeout(() => {
      this.copyText = 'COPY';
    }, 3000);
  }

  refreshId(): void {
    this.newRoomId = this.uuidService.generateUuid();
  }

  checkRoomId(): void {
    if (this.userRoomId.length === 36) {
      this.isValidUserRoomId = this.uuidService.validateUuid(this.userRoomId);
    } else {
      this.isValidUserRoomId = false;
    }
  }

  jumpToRoom(): void {
    this.utilsService.updateAlias(this.localAlias);
    this.router.navigate(['/messages', this.newRoomId]);
  }

  generateAlias(): void {
    this.localAlias = this.utilsService.generateRandomAlias();
  }

}
