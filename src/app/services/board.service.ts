import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private showMenu = true;
  menuSubject = new Subject<boolean>();

  constructor() { }

  emitMenu() {
    this.menuSubject.next(this.showMenu);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.emitMenu();
  }
}
