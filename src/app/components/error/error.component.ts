import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { ThemeColors, Titles } from 'src/app/types/enums';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})

export class ErrorComponent implements OnInit {

  constructor(private readonly _utilsService: UtilsService) { }

  ngOnInit(): void {
    this._utilsService.setTitle(Titles.Error);
    this._utilsService.updateMeta(ThemeColors.Primary);
  }

}
