import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EchelonComponent } from '../list/echelon.component';
import { EchelonDetailComponent } from '../detail/echelon-detail.component';
import { EchelonUpdateComponent } from '../update/echelon-update.component';
import { EchelonRoutingResolveService } from './echelon-routing-resolve.service';

const echelonRoute: Routes = [
  {
    path: '',
    component: EchelonComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EchelonDetailComponent,
    resolve: {
      echelon: EchelonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EchelonUpdateComponent,
    resolve: {
      echelon: EchelonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EchelonUpdateComponent,
    resolve: {
      echelon: EchelonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(echelonRoute)],
  exports: [RouterModule],
})
export class EchelonRoutingModule {}
