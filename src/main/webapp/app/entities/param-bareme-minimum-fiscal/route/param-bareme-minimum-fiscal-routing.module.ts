import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParamBaremeMinimumFiscalComponent } from '../list/param-bareme-minimum-fiscal.component';
import { ParamBaremeMinimumFiscalDetailComponent } from '../detail/param-bareme-minimum-fiscal-detail.component';
import { ParamBaremeMinimumFiscalUpdateComponent } from '../update/param-bareme-minimum-fiscal-update.component';
import { ParamBaremeMinimumFiscalRoutingResolveService } from './param-bareme-minimum-fiscal-routing-resolve.service';

const paramBaremeMinimumFiscalRoute: Routes = [
  {
    path: '',
    component: ParamBaremeMinimumFiscalComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParamBaremeMinimumFiscalDetailComponent,
    resolve: {
      paramBaremeMinimumFiscal: ParamBaremeMinimumFiscalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParamBaremeMinimumFiscalUpdateComponent,
    resolve: {
      paramBaremeMinimumFiscal: ParamBaremeMinimumFiscalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParamBaremeMinimumFiscalUpdateComponent,
    resolve: {
      paramBaremeMinimumFiscal: ParamBaremeMinimumFiscalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paramBaremeMinimumFiscalRoute)],
  exports: [RouterModule],
})
export class ParamBaremeMinimumFiscalRoutingModule {}
