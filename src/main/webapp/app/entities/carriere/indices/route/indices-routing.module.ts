import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IndicesComponent } from '../list/indices.component';
import { IndicesDetailComponent } from '../detail/indices-detail.component';
import { IndicesUpdateComponent } from '../update/indices-update.component';
import { IndicesRoutingResolveService } from './indices-routing-resolve.service';

const indicesRoute: Routes = [
  {
    path: '',
    component: IndicesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IndicesDetailComponent,
    resolve: {
      indices: IndicesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IndicesUpdateComponent,
    resolve: {
      indices: IndicesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IndicesUpdateComponent,
    resolve: {
      indices: IndicesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(indicesRoute)],
  exports: [RouterModule],
})
export class IndicesRoutingModule {}
