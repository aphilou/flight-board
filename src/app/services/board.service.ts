import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Arrival } from '../models/arrivals.model';
import { Flight } from '../models/flight.model';
import { Passenger } from '../models/passenger.model';

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
  flightSubject = new Subject<Flight[]>();

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
  passengerSubject = new Subject<Passenger[]>();

  arrivalsSubject = new Subject<Arrival[]>();

  constructor() { }

  emitMenu() {
    this.menuSubject.next(this.showMenu);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.emitMenu();
  }

  emitArrivals() {
    const arrivals: Arrival[] = [];
    this.flights.forEach((fgt) => {
      const arrival = new Arrival(fgt.name);
      arrival.passengers = this.passengers.filter( item => {
        return (item.flightId === fgt.id);
      }).map(elt => {
        return elt.name;
      });
      arrivals.push(arrival);
    });
    this.arrivalsSubject.next(arrivals.slice());
  }

  emitFlights() {
    this.flightSubject.next(this.flights.slice());
  }

  createFlight(name: string) {
    const flight = new Flight(this.flights.length + 1, name);
    this.flights.push(flight);
    this.emitFlights();
  }


  removeFlight(flight: Flight) {
    const index = this.flights.findIndex(
      (elt) => {
        if (elt === flight) {
          return true;
        }
      }
    );
    this.flights.splice(index, 1);
  }
  emitPassengers() {
    this.passengerSubject.next(this.passengers.slice());
  }

  createPassenger(name: string, fid: number) {
    const passenger = new Passenger(name, fid);
    this.passengers.push(passenger);
    this.emitPassengers();
  }

  removePassenger(passenger: Passenger) {
    const index = this.passengers.findIndex(
      (elt) => {
        if (elt === passenger) {
          return true;
        }
      }
    );
    this.passengers.splice(index, 1);
  }
}
