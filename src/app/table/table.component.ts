import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { BoardService } from '../services/board.service';
import { Flight } from '../models/flight.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  flights: Flight[];
  flightSubscription: Subscription;

  constructor(private brdService: BoardService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.flightSubscription = this.brdService.flightSubject.subscribe(
      (flights) => {
        this.flights = flights;
      }
    );
    this.brdService.emitFlights();
  }

  ngOnDestroy() {
    this.flightSubscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const name = form.value['name'];
    this.brdService.createFlight(name);
    form.reset();
  }
}
