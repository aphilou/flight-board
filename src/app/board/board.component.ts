import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  fhour = '19:00';
  flight = 'SA110715';
  from = 'martigues';
  arrivals = [ 'tokyo', 'new york', 'paris' ];
  guests = [ 'Céline Flaux', 'Antoine Grizeman' ];

  constructor() { }

  ngOnInit() {
  }

}
