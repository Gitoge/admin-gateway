import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TableTypeValeurComponent } from '../list/table-type-valeur.component';
import { TableTypeValeurDetailComponent } from '../detail/table-type-valeur-detail.component';
import { TableTypeValeurUpdateComponent } from '../update/table-type-valeur-update.component';
import { TableTypeValeurRoutingResolveService } from './table-type-valeur-routing-resolve.service';

const tableTypeValeurRoute: Routes = [
  {
    path: '',
    component: TableTypeValeurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TableTypeValeurDetailComponent,
    resolve: {
      tableTypeValeur: TableTypeValeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TableTypeValeurUpdateComponent,
    resolve: {
      tableTypeValeur: TableTypeValeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TableTypeValeurUpdateComponent,
    resolve: {
      tableTypeValeur: TableTypeValeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tableTypeValeurRoute)],
  exports: [RouterModule],
})
export class TableTypeValeurRoutingModule {}
