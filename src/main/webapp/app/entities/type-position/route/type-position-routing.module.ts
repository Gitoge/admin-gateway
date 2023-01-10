import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypePositionComponent } from '../list/type-position.component';
import { TypePositionDetailComponent } from '../detail/type-position-detail.component';
import { TypePositionUpdateComponent } from '../update/type-position-update.component';
import { TypePositionRoutingResolveService } from './type-position-routing-resolve.service';

const typePositionRoute: Routes = [
  {
    path: '',
    component: TypePositionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypePositionDetailComponent,
    resolve: {
      typePosition: TypePositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypePositionUpdateComponent,
    resolve: {
      typePosition: TypePositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypePositionUpdateComponent,
    resolve: {
      typePosition: TypePositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typePositionRoute)],
  exports: [RouterModule],
})
export class TypePositionRoutingModule {}
