import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  constructor(@Inject(ActivatedRoute) private _activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this._activatedroute.snapshot.params['roomId']);
  }

}
