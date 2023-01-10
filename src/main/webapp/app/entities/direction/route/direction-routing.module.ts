import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DirectionComponent } from '../list/direction.component';
import { DirectionDetailComponent } from '../detail/direction-detail.component';
import { DirectionUpdateComponent } from '../update/direction-update.component';
import { DirectionRoutingResolveService } from './direction-routing-resolve.service';

const directionRoute: Routes = [
  {
    path: '',
    component: DirectionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DirectionDetailComponent,
    resolve: {
      direction: DirectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DirectionUpdateComponent,
    resolve: {
      direction: DirectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DirectionUpdateComponent,
    resolve: {
      direction: DirectionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(directionRoute)],
  exports: [RouterModule],
})
export class DirectionRoutingModule {}
