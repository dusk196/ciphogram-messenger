import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IModal } from 'src/app/types/types';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})

export class InfoModalComponent {

  @Input() modalDetails: IModal = { title: '', message: '', show: false };
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal(): void {
    this.closeModalEvent.emit();
  }

}
