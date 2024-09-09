import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser'; // Importa il servizio Title

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private titleSrv: Title) {}
  title = 'Todo app';

  ngOnInit(): void {
    this.titleSrv.setTitle(this.title);
  }
}
