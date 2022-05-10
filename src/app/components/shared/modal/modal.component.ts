import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IModal } from 'src/app/types/sauf.types';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent {

  @Input() modalDetails: IModal = { title: '', message: '', show: false };
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal(): void {
    this.closeModalEvent.emit();
  }

}
