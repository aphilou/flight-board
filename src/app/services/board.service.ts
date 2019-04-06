import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Arrival } from '../models/arrivals.model';
import { Flight } from '../models/flight.model';
import { Passenger } from '../models/passenger.model';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private _jsonURL = 'assets/DbData.json';
  private showMenu = true;
  public menuSubject = new Subject<boolean>();

  private jsonUrl: SafeUrl;
  public jsonSubject = new Subject<SafeUrl>();

  public flightSrc = 'Martigues';
  public flightSrcSubject = new Subject<string>();

  public flightNumber = 'SA12345T';
  public flightNumSubject = new Subject<string>();

  public flightTime = '18:00';
  public flightTimeSubject = new Subject<string>();

  public nameSize = 1200;
  public nameSizeSubject = new Subject<number>();

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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.http.get(this._jsonURL).subscribe(
      (data: any) => {
        console.log(data);
        if (data.destinations) {
          this.flights = data.destinations;
          this.emitFlights();
        }
        if (data.passengers) {
          this.passengers = data.passengers;
          this.emitPassengers();
        }
        this.emitArrivals();
        this.generateDownloadJsonUri();
      });
  }

  generateDownloadJsonUri() {
    const exportData = {
      destinations: this.flights,
      passengers: this.passengers
    };
    const theJSON = JSON.stringify(exportData);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.jsonSubject.next(uri);
  }

  emitFlightSrc() {
    this.flightSrcSubject.next(this.flightSrc);
  }

  emitFlightTime() {
    this.flightTimeSubject.next(this.flightTime);
  }

  emitFlightNumber() {
    this.flightNumSubject.next(this.flightNumber);
  }

  emitNameSize() {
    this.nameSizeSubject.next(this.nameSize);
  }

  emitMenu() {
    this.menuSubject.next(this.showMenu);
  }

  disableMenu() {
    this.showMenu = false;
    this.emitMenu();
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
      }).join(' - ');
      arrivals.push(arrival);
    });
    this.arrivalsSubject.next(arrivals.slice());
  }

  emitFlights() {
    this.flightSubject.next(this.flights.slice());
  }

  createFlight(name: string) {
    const flight = new Flight(this.flights.length + 1, name);
    console.log('Add flight ' + flight.name + ', ' + flight.id);
    this.flights.push(flight);
    this.emitFlights();
    this.generateDownloadJsonUri();
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
    this.generateDownloadJsonUri();
  }

  emitPassengers() {
    this.passengerSubject.next(this.passengers.slice());
  }

  createPassenger(name: string, fid: number) {
    const passenger = new Passenger(name, fid);
    this.passengers.push(passenger);
    this.emitPassengers();
    this.generateDownloadJsonUri();
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
    this.generateDownloadJsonUri();
  }
}
