import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActionsComponent } from '../list/actions.component';
import { ActionsDetailComponent } from '../detail/actions-detail.component';
import { ActionsUpdateComponent } from '../update/actions-update.component';
import { ActionsRoutingResolveService } from './actions-routing-resolve.service';

const actionsRoute: Routes = [
  {
    path: '',
    component: ActionsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActionsDetailComponent,
    resolve: {
      actions: ActionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActionsUpdateComponent,
    resolve: {
      actions: ActionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActionsUpdateComponent,
    resolve: {
      actions: ActionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actionsRoute)],
  exports: [RouterModule],
})
export class ActionsRoutingModule {}
