import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParamBaremeImposableComponent } from '../list/param-bareme-imposable.component';
import { ParamBaremeImposableDetailComponent } from '../detail/param-bareme-imposable-detail.component';
import { ParamBaremeImposableUpdateComponent } from '../update/param-bareme-imposable-update.component';
import { ParamBaremeImposableRoutingResolveService } from './param-bareme-imposable-routing-resolve.service';

const paramBaremeImposableRoute: Routes = [
  {
    path: '',
    component: ParamBaremeImposableComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParamBaremeImposableDetailComponent,
    resolve: {
      paramBaremeImposable: ParamBaremeImposableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParamBaremeImposableUpdateComponent,
    resolve: {
      paramBaremeImposable: ParamBaremeImposableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParamBaremeImposableUpdateComponent,
    resolve: {
      paramBaremeImposable: ParamBaremeImposableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paramBaremeImposableRoute)],
  exports: [RouterModule],
})
export class ParamBaremeImposableRoutingModule {}
