import { Component, OnInit } from '@angular/core';
import { UuidService } from './../../services/uuid.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private uuidService: UuidService) { }

  ngOnInit(): void {
    console.log(this.uuidService.generateUuid());
  }

}
