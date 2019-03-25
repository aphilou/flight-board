import { Component, OnInit, OnDestroy } from '@angular/core';
import { Arrival } from '../models/arrivals.model';
import { BoardService } from '../services/board.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  fhour = '19:00';
  flight = 'SA110715';
  from = 'martigues';

  arrivals = [ 'tokyo', 'new york', 'paris' ];
  guests = [ 'Céline Flaux', 'Antoine Grizeman' ];

  flights: Arrival[];
  flightsSubscription: Subscription;

  constructor(private boardService: BoardService) { }

  ngOnInit() {
    this.flightsSubscription = this.boardService.arrivalsSubject.subscribe(
      (elt: Arrival[]) => {
        this.flights = elt;
      }
    );
    this.boardService.emitArrivals();
  }

  ngOnDestroy(): void {
    this.flightsSubscription.unsubscribe();
  }
}
