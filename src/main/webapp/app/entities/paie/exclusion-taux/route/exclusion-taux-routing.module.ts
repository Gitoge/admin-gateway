import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExclusionTauxComponent } from '../list/exclusion-taux.component';
import { ExclusionTauxDetailComponent } from '../detail/exclusion-taux-detail.component';
import { ExclusionTauxUpdateComponent } from '../update/exclusion-taux-update.component';
import { ExclusionTauxRoutingResolveService } from './exclusion-taux-routing-resolve.service';

const exclusionTauxRoute: Routes = [
  {
    path: '',
    component: ExclusionTauxComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExclusionTauxDetailComponent,
    resolve: {
      exclusionTaux: ExclusionTauxRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExclusionTauxUpdateComponent,
    resolve: {
      exclusionTaux: ExclusionTauxRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExclusionTauxUpdateComponent,
    resolve: {
      exclusionTaux: ExclusionTauxRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exclusionTauxRoute)],
  exports: [RouterModule],
})
export class ExclusionTauxRoutingModule {}
