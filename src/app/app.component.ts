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
  }

  ngOnDestroy(): void {
    this.showMenuSubscription.unsubscribe();
  }

  toggleMenu() {
    this.boardService.toggleMenu();
  }

  @HostListener('document:keydown.escape', ['$event']) 
  onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    if (!this.showMenu) {
      this.boardService.toggleMenu();
    }
  }
}
