import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})

export class ErrorComponent implements OnInit {

  constructor(private readonly _utilsService: UtilsService) { }

  ngOnInit(): void {
    this._utilsService.removeStickyNav();
  }

}
