import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BilleteurComponent } from '../list/billeteur.component';
import { BilleteurDetailComponent } from '../detail/billeteur-detail.component';
import { BilleteurUpdateComponent } from '../update/billeteur-update.component';
import { BilleteurRoutingResolveService } from './billeteur-routing-resolve.service';

const billeteurRoute: Routes = [
  {
    path: '',
    component: BilleteurComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BilleteurDetailComponent,
    resolve: {
      billeteur: BilleteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BilleteurUpdateComponent,
    resolve: {
      billeteur: BilleteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BilleteurUpdateComponent,
    resolve: {
      billeteur: BilleteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(billeteurRoute)],
  exports: [RouterModule],
})
export class BilleteurRoutingModule {}
