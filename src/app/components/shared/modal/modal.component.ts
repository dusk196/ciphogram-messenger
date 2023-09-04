import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IModal } from 'src/app/types/types';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})

export class ModalComponent {

  @Input() modalDetails: IModal = { title: '', message: '', show: false, typeHtml: false };
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal(): void {
    this.closeModalEvent.emit();
  }

}
