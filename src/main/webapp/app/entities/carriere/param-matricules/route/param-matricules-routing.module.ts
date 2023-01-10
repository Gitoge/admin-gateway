import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParamMatriculesComponent } from '../list/param-matricules.component';
import { ParamMatriculesDetailComponent } from '../detail/param-matricules-detail.component';
import { ParamMatriculesUpdateComponent } from '../update/param-matricules-update.component';
import { ParamMatriculesRoutingResolveService } from './param-matricules-routing-resolve.service';

const paramMatriculesRoute: Routes = [
  {
    path: '',
    component: ParamMatriculesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParamMatriculesDetailComponent,
    resolve: {
      paramMatricules: ParamMatriculesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParamMatriculesUpdateComponent,
    resolve: {
      paramMatricules: ParamMatriculesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParamMatriculesUpdateComponent,
    resolve: {
      paramMatricules: ParamMatriculesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paramMatriculesRoute)],
  exports: [RouterModule],
})
export class ParamMatriculesRoutingModule {}
