import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SituationFamilialeComponent } from '../list/situation-familiale.component';
import { SituationFamilialeDetailComponent } from '../detail/situation-familiale-detail.component';
import { SituationFamilialeUpdateComponent } from '../update/situation-familiale-update.component';
import { SituationFamilialeRoutingResolveService } from './situation-familiale-routing-resolve.service';

const situationFamilialeRoute: Routes = [
  {
    path: '',
    component: SituationFamilialeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SituationFamilialeDetailComponent,
    resolve: {
      situationFamiliale: SituationFamilialeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SituationFamilialeUpdateComponent,
    resolve: {
      situationFamiliale: SituationFamilialeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SituationFamilialeUpdateComponent,
    resolve: {
      situationFamiliale: SituationFamilialeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(situationFamilialeRoute)],
  exports: [RouterModule],
})
export class SituationFamilialeRoutingModule {}
