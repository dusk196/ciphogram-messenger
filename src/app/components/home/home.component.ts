import { Component, OnInit } from '@angular/core';
import { UuidService } from './../../services/uuid.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  newRoomId: string = '';
  copyText: string = 'COPY';

  constructor(private uuidService: UuidService) { }

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

}
