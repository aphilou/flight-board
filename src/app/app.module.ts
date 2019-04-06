import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { GuestComponent } from './guest/guest.component';
import { TableComponent } from './table/table.component';
import { Routes, RouterModule } from '@angular/router';
import { BoardService } from './services/board.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelpComponent } from './help/help.component';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    GuestComponent,
    TableComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxBootstrapSliderModule
  ],
  providers: [
    BoardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
