import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';
import { JoinComponent } from './components/join/join.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ErrorComponent } from './components/error/error.component';

import { RoutePaths } from './types/enums';

const routes: Routes = [
  { path: RoutePaths.Home, component: HomeComponent },
  { path: RoutePaths.Start, component: StartComponent },
  { path: `${RoutePaths.Join}/:${RoutePaths.JoinId}`, component: JoinComponent },
  { path: `${RoutePaths.Messages}/:${RoutePaths.RoomId}`, component: MessagesComponent },
  { path: '', redirectTo: RoutePaths.Home, pathMatch: 'full' },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
