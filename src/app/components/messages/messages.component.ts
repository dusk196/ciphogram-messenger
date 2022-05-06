import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UtilsService } from './../../services/utils.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit, OnDestroy {

  readonly roomId = this._activatedroute.snapshot.params['roomId'];
  localAlias = {
    main: '',
    formData: ''
  };
  subscription: Subscription = new Subscription();


  constructor(
    @Inject(ActivatedRoute)
    private _activatedroute: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    this.subscription = this.utilsService.getAlias().subscribe((alias: string) => {
      console.log(alias)
      if (!this.utilsService.isNullOrEmpty(alias)) {
        this.localAlias.main = alias;
        this.localAlias.formData = alias;
      }
    });
  }

  ngOnInit(): void {
    console.log(this._activatedroute.snapshot.params['roomId']);
  }

  generateAlias(): void {
    const newAlias = this.utilsService.generateRandomAlias();
    this.utilsService.updateAlias(newAlias);
  }

  updateAlias(): void {
    this.utilsService.updateAlias(this.localAlias.formData);
  }

  ngOnDestroy(): void {
    this.utilsService.updateAlias('');
    this.subscription.unsubscribe();
  }

}
