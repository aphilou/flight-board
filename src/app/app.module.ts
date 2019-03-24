import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { GuestComponent } from './guest/guest.component';
import { TableComponent } from './table/table.component';
import { Routes, RouterModule } from '@angular/router';
import { BoardService } from './services/board.service';

const appRoutes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'table', component: TableComponent }
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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    BoardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
