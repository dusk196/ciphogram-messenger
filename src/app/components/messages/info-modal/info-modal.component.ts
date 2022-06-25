import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { faUser, faRotateRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/services/utils.service';
import { IInfoModal } from 'src/app/types/types';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})

export class InfoModalComponent implements OnChanges {

  @Input() modalDetails: IInfoModal = { type: '', show: false, isDarkMode: true };
  @Output() closeModalEvent = new EventEmitter<void>();

  faUser: IconDefinition = faUser;
  faRotateRight: IconDefinition = faRotateRight;
  aliasName: string = '';

  constructor(private readonly _utilsService: UtilsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['modalDetails']);
  }

  generateAlias(): void {
    // this.aliasName = this._utilsService.generateRandomAlias();
    // this._utilsService.devConsoleLog('Generated alias ID: ', this.userDetails.id);
    // this._utilsService.devConsoleLog('Generated alias: ', this.userDetails.name);
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }

}
