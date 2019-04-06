import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BoardService } from './services/board.service';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'flight-board';
  destination = 'Martigues';
  ftime = '19:00';
  fnumber = 'SA110715';
  namesize: number;

  showMenu: boolean;
  showMenuSubscription: Subscription;
  downloadJsonHref: SafeUrl;
  jsonSubscription: Subscription;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.showMenuSubscription = this.boardService.menuSubject.subscribe(
      (show: boolean) => {
        this.showMenu = show;
      }
    );
    this.boardService.emitMenu();
    this.jsonSubscription = this.boardService.jsonSubject.subscribe(
      (uri: SafeUrl) => {
        this.downloadJsonHref = uri;
      }
    );
    this.namesize = this.boardService.nameSize;
    this.boardService.emitNameSize();
  }

  ngOnDestroy(): void {
    this.showMenuSubscription.unsubscribe();
  }

  toggleMenu() {
    this.boardService.toggleMenu();
  }

  onDestinationChange() {
    this.boardService.flightSrc = (this.destination + '          ').slice(0, 9);
    console.log('Change {}', this.boardService.flightSrc);
    this.boardService.emitFlightSrc();
  }

  onTimeChange() {
    this.boardService.flightTime = (this.ftime + '     ').slice(0, 5);
    this.boardService.emitFlightTime();
  }

  onNumberChange() {
    this.boardService.flightNumber = (this.fnumber + '        ').slice(0, 8);
    this.boardService.emitFlightNumber();
  }

  onNameSize() {
    console.log('Name size = ', this.namesize);
    this.boardService.nameSize = this.namesize;
    this.boardService.emitNameSize();
  }

  slideStop() {
    console.log('Stopped');
    console.log('Name size = ', this.namesize);
    this.boardService.nameSize = this.namesize;
    this.boardService.emitNameSize();
    }
}
