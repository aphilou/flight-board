import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { Arrival } from '../models/arrivals.model';
import { BoardService } from '../services/board.service';
import { Subscription, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

const stateDefault = 'default';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default',  style({ transform: 'rotate(0)' })),
      state('upone',    style({ transform: 'rotate(-25deg)' })),
      state('uptwo',    style({ transform: 'rotate(-50deg)' })),
      state('downone', style({ transform: 'rotate(45deg)' })),
      state('downtwo',  style({ transform: 'rotate(90deg)' })),
      transition('* => downone', animate('1500ms')),
      transition('* => downtwo', animate('1500ms')),
      transition('* => upone',   animate('1500ms')),
      transition('* => uptwo',   animate('1500ms')),
      transition('* => default', animate('2000ms ease-out')),
  ])
]})
export class BoardComponent implements OnInit, OnDestroy {

  state = stateDefault;
  states = [ 'uptwo', 'upone', 'default', 'downone', 'downtwo' ];
  stateOffset = 2;
  planeAnimation = false;
  withNoMenu = false;

  maxSize = 60;
  fhour = '19:00';
  @Input('flight-input') flight = 'SA110715';
  from = 'martigues';
  nameSize = 1200;
  flightSrc$: Subscription;
  flightTime$: Subscription;
  flightNum$: Subscription;
  nameSize$: Subscription;

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

  constructor(private boardService: BoardService, private route: ActivatedRoute) {
    // console.log('On BoardComponent constructor...');
    // console.log('body.height = ', document.body.clientHeight);
    // console.log('diffHeight = ', this.diffHeight);
    route.data.subscribe(v => {
      console.log('Board data ', v);
      if (v.nomenu) {
        this.withNoMenu = v.nomenu;
      } else {
        this.withNoMenu = false;
      }
      console.log('withNoMenu = ', this.withNoMenu);
    });
  }

  ngOnInit() {
    //console.log('On BoardComponent init...', this.withNoMenu);
    if (this.withNoMenu) {
      this.boardService.disableMenu();
    }
    this.flightSrc$ = this.boardService.flightSrcSubject.subscribe(
      (fs) => {
        this.from = fs;
      }
    );
    this.flightTime$ = this.boardService.flightTimeSubject.subscribe(
      (ft) => {
        this.fhour = ft;
      }
    );
    this.flightNum$ = this.boardService.flightNumSubject.subscribe(
      (fn) => {
        this.flight = fn;
      }
    );
    this.nameSize$ = this.boardService.nameSizeSubject.subscribe(
      ns => this.nameSize = ns
    );
    this.from = this.boardService.flightSrc;
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
      // console.log('pageYOffset = ', data);
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
      if (this.planeAnimation) {
        const off = Math.trunc( Math.random() * 5 );
        this.state = this.states[off];
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    this.flightsSubscription.unsubscribe();
    this.scrollDownSubscription.unsubscribe();
    this.flightSrc$.unsubscribe();
    this.flightTime$.unsubscribe();
    this.flightNum$.unsubscribe();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeHandler(event: KeyboardEvent) {
    if (!this.withNoMenu) {
      this.boardService.toggleMenu();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    //console.log(event);
    if ((event.key === 'A') || (event.key === 'a')) {
      this.planeAnimation = !this.planeAnimation;
    } else if ((event.key === 'D') || (event.key === 'd')) {
      this.planeAnimation = false;
      this.stopScrolling = true;
      this.scrollTo = 0;
      window.scrollTo(0, this.scrollTo);
      this.state = stateDefault;
      this.stateOffset = 3;
    } else if (event.key === ' ') {
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
    } else if (event.keyCode === 37) {
      if (this.stateOffset > 0) {
        this.stateOffset -= 1;
        this.state = this.states[this.stateOffset];
      }
    } else if (event.keyCode === 39) {
      if (this.stateOffset < (this.states.length - 1)) {
        this.stateOffset += 1;
        this.state = this.states[this.stateOffset];
      }
    }
  }
}
