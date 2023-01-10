import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NationaliteComponent } from '../list/nationalite.component';
import { NationaliteDetailComponent } from '../detail/nationalite-detail.component';
import { NationaliteUpdateComponent } from '../update/nationalite-update.component';
import { NationaliteRoutingResolveService } from './nationalite-routing-resolve.service';

const nationaliteRoute: Routes = [
  {
    path: '',
    component: NationaliteComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NationaliteDetailComponent,
    resolve: {
      nationalite: NationaliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NationaliteUpdateComponent,
    resolve: {
      nationalite: NationaliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NationaliteUpdateComponent,
    resolve: {
      nationalite: NationaliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(nationaliteRoute)],
  exports: [RouterModule],
})
export class NationaliteRoutingModule {}
