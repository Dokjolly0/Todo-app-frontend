import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-eyes-icon',
  templateUrl: './eyes-icon.component.html',
  styleUrls: ['./eyes-icon.component.css'],
  host: {
    '(click)': 'onClick()',
  },
})
export class EyesIconComponent {
  @Output() state = new EventEmitter<boolean>();
  @Input() size: string = '32px'; // Dimensione predefinita
  isOpen: boolean = false;

  // Metodo per gestire il clic e emettere l'evento
  onClick(): void {
    this.isOpen = !this.isOpen;
    this.state.emit(this.isOpen);
  }
}
