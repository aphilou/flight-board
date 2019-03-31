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
        this.flights.forEach(
          (f) => {
            console.log('F: ' + f.name + ' / #' + f.id);
          }
        );
      }
    );
    this.brdService.emitFlights();
    this.passengerSubscription = this.brdService.passengerSubject.subscribe(
      (passengers) => {
        this.passengers = passengers.sort((pa, pb) => {
          return pa.name.localeCompare(pb.name);
        });
      }
    );
    this.brdService.emitPassengers();
  }

  ngOnDestroy() {
    this.flightSubscription.unsubscribe();
    this.passengerSubscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const name = form.value[ 'name' ];
    const flightId = form.value[ 'flight' ];
    this.brdService.createPassenger(name, flightId);
    form.reset();
  }

  onRemove(passenger: Passenger) {
    this.brdService.removePassenger(passenger);
    this.brdService.emitPassengers();
  }

  getFlightInfo(passenger: Passenger) {
    //console.log('Tooltip for ', passenger.name);
    const flight = this.flights.find(ite => (ite.id === passenger.flightId) );
    return flight.name + ' - ' + this.getPassengers(flight);
  }

  getPassengers(flight: Flight): string {
    const inFlight = this.passengers.filter(item => {
      return (item.flightId === flight.id);
    }).map(elt => {
      return elt.name;
    });
    return inFlight.join('/');
  }
}
