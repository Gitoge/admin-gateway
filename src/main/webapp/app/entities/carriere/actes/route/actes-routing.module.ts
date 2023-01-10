import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActesComponent } from '../list/actes.component';
import { ActesDetailComponent } from '../detail/actes-detail.component';
import { ActesUpdateComponent } from '../update/actes-update.component';
import { ActesRoutingResolveService } from './actes-routing-resolve.service';

const actesRoute: Routes = [
  {
    path: '',
    component: ActesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActesDetailComponent,
    resolve: {
      actes: ActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActesUpdateComponent,
    resolve: {
      actes: ActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActesUpdateComponent,
    resolve: {
      actes: ActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actesRoute)],
  exports: [RouterModule],
})
export class ActesRoutingModule {}
