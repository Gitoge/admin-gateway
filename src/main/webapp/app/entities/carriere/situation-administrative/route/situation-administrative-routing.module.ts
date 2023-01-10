import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SituationAdministrativeComponent } from '../list/situation-administrative.component';
import { SituationAdministrativeDetailComponent } from '../detail/situation-administrative-detail.component';
import { SituationAdministrativeUpdateComponent } from '../update/situation-administrative-update.component';
import { SituationAdministrativeRoutingResolveService } from './situation-administrative-routing-resolve.service';

const situationAdministrativeRoute: Routes = [
  {
    path: '',
    component: SituationAdministrativeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SituationAdministrativeDetailComponent,
    resolve: {
      situationAdministrative: SituationAdministrativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SituationAdministrativeUpdateComponent,
    resolve: {
      situationAdministrative: SituationAdministrativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SituationAdministrativeUpdateComponent,
    resolve: {
      situationAdministrative: SituationAdministrativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(situationAdministrativeRoute)],
  exports: [RouterModule],
})
export class SituationAdministrativeRoutingModule {}
