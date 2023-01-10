import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TableValeurComponent } from '../list/table-valeur.component';
import { TableValeurDetailComponent } from '../detail/table-valeur-detail.component';
import { TableValeurUpdateComponent } from '../update/table-valeur-update.component';
import { TableValeurRoutingResolveService } from './table-valeur-routing-resolve.service';

const tableValeurRoute: Routes = [
  {
    path: '',
    component: TableValeurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TableValeurDetailComponent,
    resolve: {
      tableValeur: TableValeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TableValeurUpdateComponent,
    resolve: {
      tableValeur: TableValeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TableValeurUpdateComponent,
    resolve: {
      tableValeur: TableValeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tableValeurRoute)],
  exports: [RouterModule],
})
export class TableValeurRoutingModule {}
