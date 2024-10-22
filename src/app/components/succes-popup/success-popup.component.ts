import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css'],
})
export class SuccessPopupComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Operazione completata!';
  @Output() closed = new EventEmitter<void>();

  closePopup() {
    this.show = false;
    this.closed.emit();
  }
}
