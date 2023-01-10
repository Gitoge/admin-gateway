import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParamBulletinsComponent } from '../list/param-bulletins.component';
import { ParamBulletinsDetailComponent } from '../detail/param-bulletins-detail.component';
import { ParamBulletinsUpdateComponent } from '../update/param-bulletins-update.component';
import { ParamBulletinsRoutingResolveService } from './param-bulletins-routing-resolve.service';

const paramBulletinsRoute: Routes = [
  {
    path: '',
    component: ParamBulletinsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParamBulletinsDetailComponent,
    resolve: {
      paramBulletins: ParamBulletinsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParamBulletinsUpdateComponent,
    resolve: {
      paramBulletins: ParamBulletinsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParamBulletinsUpdateComponent,
    resolve: {
      paramBulletins: ParamBulletinsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paramBulletinsRoute)],
  exports: [RouterModule],
})
export class ParamBulletinsRoutingModule {}
