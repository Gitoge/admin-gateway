import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParamQuotiteCessibleComponent } from '../list/param-quotite-cessible.component';
import { ParamQuotiteCessibleDetailComponent } from '../detail/param-quotite-cessible-detail.component';
import { ParamQuotiteCessibleUpdateComponent } from '../update/param-quotite-cessible-update.component';
import { ParamQuotiteCessibleRoutingResolveService } from './param-quotite-cessible-routing-resolve.service';

const paramQuotiteCessibleRoute: Routes = [
  {
    path: '',
    component: ParamQuotiteCessibleComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParamQuotiteCessibleDetailComponent,
    resolve: {
      paramQuotiteCessible: ParamQuotiteCessibleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParamQuotiteCessibleUpdateComponent,
    resolve: {
      paramQuotiteCessible: ParamQuotiteCessibleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParamQuotiteCessibleUpdateComponent,
    resolve: {
      paramQuotiteCessible: ParamQuotiteCessibleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paramQuotiteCessibleRoute)],
  exports: [RouterModule],
})
export class ParamQuotiteCessibleRoutingModule {}
