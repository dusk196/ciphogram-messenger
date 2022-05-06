import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from './../../services/utils.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit, OnDestroy {

  readonly roomId = this._activatedroute.snapshot.params['roomId'];
  localAlias: string = '';


  constructor(
    @Inject(ActivatedRoute) private _activatedroute: ActivatedRoute,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    console.log(this._activatedroute.snapshot.params['roomId']);
  }

  generateAlias(): void {
    this.localAlias = this.utilsService.generateRandomAlias();
  }

  ngOnDestroy(): void {
    alert('destroyed');
  }

}
