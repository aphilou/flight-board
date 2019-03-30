import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Arrival } from '../models/arrivals.model';
import { BoardService } from '../services/board.service';
import { Subscription, Observable } from 'rxjs';
import { Key } from 'protractor';

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
  keyScrollIncrement = 20;
  stopScrolling = true;
  pauseScrolling = false;

  constructor(private boardService: BoardService) {
    console.debug('On BoardComponent constructor...');
    console.log('body.height = ', document.body.clientHeight);
    console.log('diffHeight = ', this.diffHeight);
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
      }, 200);
    })
    .subscribe(data => {
      console.log('pageYOffset = ', data);
      if (this.diffHeight == null) {
        const scrollHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        );
        if (window.innerHeight && scrollHeight) {
          this.diffHeight = scrollHeight - window.innerHeight;
        } else {
          this.diffHeight = 0;
        }
        console.log('body.height = ', document.body.clientHeight);
        console.log('scrollHeight = ', scrollHeight);
        console.log('diffHeight = ', this.diffHeight);
      }
      if (this.diffHeight > 0 && !this.stopScrolling && !this.pauseScrolling) {
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
    setInterval(() => {
      if (!this.stopScrolling) {
        this.pauseScrolling = !this.pauseScrolling;
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    this.flightsSubscription.unsubscribe();
    this.scrollDownSubscription.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    if (event.key === ' ') {
      this.pauseScrolling = this.stopScrolling;
      this.stopScrolling = !this.stopScrolling;
      if (!this.stopScrolling) {
        const scrollHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        );
        if (window.innerHeight && scrollHeight) {
          this.diffHeight = scrollHeight - window.innerHeight;
        } else {
          this.diffHeight = 0;
        }
      }
    } else if (event.keyCode === 38) {
      if (this.diffHeight > 0) {
        if (this.scrollTo - this.keyScrollIncrement < 0) {
          this.scrollTo = 0;
        } else {
          this.scrollTo -= this.keyScrollIncrement;
        }
        window.scrollTo(0, this.scrollTo);
      }
    } else if (event.keyCode === 40) {
      if (this.diffHeight > 0) {
        if (this.scrollTo + this.keyScrollIncrement > this.diffHeight) {
          this.scrollTo = this.diffHeight;
        } else {
          this.scrollTo += this.keyScrollIncrement;
        }
        window.scrollTo(0, this.scrollTo);
      }
    }
  }
}
