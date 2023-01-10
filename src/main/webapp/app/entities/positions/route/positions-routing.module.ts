import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PositionsComponent } from '../list/positions.component';
import { PositionsDetailComponent } from '../detail/positions-detail.component';
import { PositionsUpdateComponent } from '../update/positions-update.component';
import { PositionsRoutingResolveService } from './positions-routing-resolve.service';

const positionsRoute: Routes = [
  {
    path: '',
    component: PositionsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionsDetailComponent,
    resolve: {
      positions: PositionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionsUpdateComponent,
    resolve: {
      positions: PositionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionsUpdateComponent,
    resolve: {
      positions: PositionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(positionsRoute)],
  exports: [RouterModule],
})
export class PositionsRoutingModule {}
