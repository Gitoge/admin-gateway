import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PeriodePayeComponent } from '../list/periode-paye.component';
import { PeriodePayeDetailComponent } from '../detail/periode-paye-detail.component';
import { PeriodePayeUpdateComponent } from '../update/periode-paye-update.component';
import { PeriodePayeRoutingResolveService } from './periode-paye-routing-resolve.service';

const periodePayeRoute: Routes = [
  {
    path: '',
    component: PeriodePayeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PeriodePayeDetailComponent,
    resolve: {
      periodePaye: PeriodePayeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PeriodePayeUpdateComponent,
    resolve: {
      periodePaye: PeriodePayeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PeriodePayeUpdateComponent,
    resolve: {
      periodePaye: PeriodePayeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(periodePayeRoute)],
  exports: [RouterModule],
})
export class PeriodePayeRoutingModule {}
