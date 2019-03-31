import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { GuestComponent } from './guest/guest.component';
import { TableComponent } from './table/table.component';
import { BoardComponent } from './board/board.component';

const appRoutes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'table', component: TableComponent },
  { path: 'help',  component: HelpComponent },
  { path: '', redirectTo: '/board', pathMatch: 'full' },
  { path: '**', component: HelpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
