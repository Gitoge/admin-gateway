import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReglementComponent } from '../list/reglement.component';
import { ReglementDetailComponent } from '../detail/reglement-detail.component';
import { ReglementUpdateComponent } from '../update/reglement-update.component';
import { ReglementRoutingResolveService } from './reglement-routing-resolve.service';

const reglementRoute: Routes = [
  {
    path: '',
    component: ReglementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReglementDetailComponent,
    resolve: {
      reglement: ReglementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReglementUpdateComponent,
    resolve: {
      reglement: ReglementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReglementUpdateComponent,
    resolve: {
      reglement: ReglementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reglementRoute)],
  exports: [RouterModule],
})
export class ReglementRoutingModule {}
