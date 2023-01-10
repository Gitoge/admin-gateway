import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConventionComponent } from '../list/convention.component';
import { ConventionDetailComponent } from '../detail/convention-detail.component';
import { ConventionUpdateComponent } from '../update/convention-update.component';
import { ConventionRoutingResolveService } from './convention-routing-resolve.service';

const conventionRoute: Routes = [
  {
    path: '',
    component: ConventionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConventionDetailComponent,
    resolve: {
      convention: ConventionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConventionUpdateComponent,
    resolve: {
      convention: ConventionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConventionUpdateComponent,
    resolve: {
      convention: ConventionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(conventionRoute)],
  exports: [RouterModule],
})
export class ConventionRoutingModule {}
