import { Component, OnInit, OnDestroy } from '@angular/core';
import { Flight } from '../models/flight.model';
import { Subscription } from 'rxjs';
import { BoardService } from '../services/board.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { Passenger } from '../models/passenger.model';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit, OnDestroy {

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
    this.passengerSubscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    console.log('onSubmit');
  }
}
