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
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';

const appRoutes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'table', component: TableComponent },
  { path: '', component: BoardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    GuestComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    BoardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
