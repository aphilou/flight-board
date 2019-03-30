import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { BoardService } from '../services/board.service';
import { Flight } from '../models/flight.model';
import { Subscription } from 'rxjs';
import { Arrival } from '../models/arrivals.model';
import { Passenger } from '../models/passenger.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  flights: Flight[];
  flightSubscription: Subscription;
  passengers: Passenger[];
  passengerSubscription: Subscription;

  constructor(private brdService: BoardService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.flightSubscription = this.brdService.flightSubject.subscribe(
      (flights) => {
        this.flights = flights;
      }
    );
    this.brdService.emitFlights();
    this.passengerSubscription = this.brdService.passengerSubject.subscribe(
      (passengers) => {
        this.passengers = passengers;
      }
    );
    this.brdService.emitPassengers();
  }

  ngOnDestroy() {
    this.flightSubscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const name = form.value['name'];
    this.brdService.createFlight(name);
    form.reset();
  }

  onRemove(flight: Flight) {
    this.brdService.removeFlight(flight);
    this.brdService.emitFlights();
  }

  getPassengerNb(flight: Flight): number {
    const inFlight = this.passengers.filter(
      (item: Passenger) => {
        return (flight.id === item.flightId);
      }
    );
    if (inFlight) {
      return inFlight.length;
    } else {
      return 0;
    }
  }
}
