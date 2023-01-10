import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EnfantComponent } from '../list/enfant.component';
import { EnfantDetailComponent } from '../detail/enfant-detail.component';
import { EnfantUpdateComponent } from '../update/enfant-update.component';
import { GrappeFamilialeComponent } from '../grappe-familiale/grappe-familiale.component';
import { EnfantRoutingResolveService } from './enfant-routing-resolve.service';

const enfantRoute: Routes = [
  {
    path: '',
    component: EnfantComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EnfantDetailComponent,
    resolve: {
      enfant: EnfantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EnfantUpdateComponent,
    resolve: {
      enfant: EnfantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'grappe-familiale',
    component: GrappeFamilialeComponent,
    resolve: {
      enfant: EnfantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EnfantUpdateComponent,
    resolve: {
      enfant: EnfantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(enfantRoute)],
  exports: [RouterModule],
})
export class EnfantRoutingModule {}
