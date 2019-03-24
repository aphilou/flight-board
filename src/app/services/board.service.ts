import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private showMenu = true;
  menuSubject = new Subject<boolean>();

  private flights = [
    {
      id: 1,
      name: 'Tokyo'
    },
    {
      id: 2,
      name: 'Madrid'
    }
  ];

  private passengers = [
    {
      name: 'Céline Flaux',
      flightId: 1
    },
    {
      name: 'Antoine Griezemman',
      flightId: 1
    },
    {
      name: 'John Do',
      flightId: 2
    }

  ];
  constructor() { }

  emitMenu() {
    this.menuSubject.next(this.showMenu);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.emitMenu();
  }
}
