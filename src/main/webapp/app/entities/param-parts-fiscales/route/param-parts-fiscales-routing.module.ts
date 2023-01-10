import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParamPartsFiscalesComponent } from '../list/param-parts-fiscales.component';
import { ParamPartsFiscalesDetailComponent } from '../detail/param-parts-fiscales-detail.component';
import { ParamPartsFiscalesUpdateComponent } from '../update/param-parts-fiscales-update.component';
import { ParamPartsFiscalesRoutingResolveService } from './param-parts-fiscales-routing-resolve.service';

const paramPartsFiscalesRoute: Routes = [
  {
    path: '',
    component: ParamPartsFiscalesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParamPartsFiscalesDetailComponent,
    resolve: {
      paramPartsFiscales: ParamPartsFiscalesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParamPartsFiscalesUpdateComponent,
    resolve: {
      paramPartsFiscales: ParamPartsFiscalesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParamPartsFiscalesUpdateComponent,
    resolve: {
      paramPartsFiscales: ParamPartsFiscalesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paramPartsFiscalesRoute)],
  exports: [RouterModule],
})
export class ParamPartsFiscalesRoutingModule {}
