import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser'; // Title service

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  constructor(private titleSrv: Title) {}
  pageTitle = 'Page not found';

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
  }
}
