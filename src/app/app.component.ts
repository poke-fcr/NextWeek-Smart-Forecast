import { Component, OnInit, Signal, signal } from '@angular/core';
import { DataService } from './services/data.service';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AboutComponent, HomeComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'nextweek-smart-forecast';
  activePage!: Signal<"about" | "home">
  constructor(public dataSvc: DataService) {
  }

  ngOnInit() {
    this.activePage = this.dataSvc.getActivePage()
  }

  loadAbout() {
    this.dataSvc.setActivePage('about')
  }



}
