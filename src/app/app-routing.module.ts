import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ErrorComponent } from './components/error/error.component';

import { RoutePaths } from './types/routes.types';

const routes: Routes = [
  { path: RoutePaths.Home, component: HomeComponent },
  { path: `${RoutePaths.Messages}/:${RoutePaths.RoomId}`, component: MessagesComponent },
  { path: '', redirectTo: RoutePaths.Home, pathMatch: 'full' },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
