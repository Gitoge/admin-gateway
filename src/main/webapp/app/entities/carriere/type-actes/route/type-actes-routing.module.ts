import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeActesComponent } from '../list/type-actes.component';
import { TypeActesDetailComponent } from '../detail/type-actes-detail.component';
import { TypeActesUpdateComponent } from '../update/type-actes-update.component';
import { TypeActesRoutingResolveService } from './type-actes-routing-resolve.service';

const typeActesRoute: Routes = [
  {
    path: '',
    component: TypeActesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeActesDetailComponent,
    resolve: {
      typeActes: TypeActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeActesUpdateComponent,
    resolve: {
      typeActes: TypeActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeActesUpdateComponent,
    resolve: {
      typeActes: TypeActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeActesRoute)],
  exports: [RouterModule],
})
export class TypeActesRoutingModule {}
