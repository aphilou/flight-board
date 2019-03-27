import { Component, OnInit, OnDestroy } from '@angular/core';
import { Arrival } from '../models/arrivals.model';
import { BoardService } from '../services/board.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  maxSize = 60;
  fhour = '19:00';
  flight = 'SA110715';
  from = 'martigues';

  arrivals = [ 'tokyo', 'new york', 'paris' ];
  guests = [ 'Céline Flaux', 'Antoine Grizeman' ];

  flights: Arrival[];
  flightsSubscription: Subscription;
  scrollDownSubscription: Subscription;
  diffHeight: number;
  scrollTo = 0;
  scrollIncrement = 10;

  constructor(private boardService: BoardService) {
    console.debug('On BoardComponent constructor...');
    console.log('windows.height = ', document.body.scrollHeight);
    console.log('body.height = ', document.body.clientHeight);
    if (document.body.scrollHeight && document.body.clientHeight) {
      this.diffHeight = document.body.scrollHeight - document.body.clientHeight;
    } else {
      this.diffHeight = 0;
    }
  }

  ngOnInit() {
    console.debug('On BoardComponent init...');
    this.flightsSubscription = this.boardService.arrivalsSubject.subscribe(
      (elt: Arrival[]) => {
        this.flights = elt;
      }
    );
    this.boardService.emitArrivals();
    this.scrollDownSubscription  = new Observable( (observer) => {
      setInterval(() => {
        observer.next(window.pageYOffset);
      }, 500);
    })
    .subscribe(data => { 
      console.log('pageYOffset = ', data);
      if (this.diffHeight > 0) {
        if (this.scrollTo + this.scrollIncrement > this.diffHeight) {
          this.scrollTo = this.diffHeight;
          this.scrollIncrement = -this.scrollIncrement;
        } else if (this.scrollTo + this.scrollIncrement < 0) {
          this.scrollTo = 0;
          this.scrollIncrement = -this.scrollIncrement;
        } else {
          this.scrollTo += this.scrollIncrement;
        }
        window.scrollTo(0, this.scrollTo);
      }
    });
  }

  ngOnDestroy(): void {
    this.flightsSubscription.unsubscribe();
    this.scrollDownSubscription.unsubscribe();
  }
}
