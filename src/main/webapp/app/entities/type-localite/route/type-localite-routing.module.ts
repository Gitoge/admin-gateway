import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeLocaliteComponent } from '../list/type-localite.component';
import { TypeLocaliteDetailComponent } from '../detail/type-localite-detail.component';
import { TypeLocaliteUpdateComponent } from '../update/type-localite-update.component';
import { TypeLocaliteRoutingResolveService } from './type-localite-routing-resolve.service';

const typeLocaliteRoute: Routes = [
  {
    path: '',
    component: TypeLocaliteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeLocaliteDetailComponent,
    resolve: {
      typeLocalite: TypeLocaliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeLocaliteUpdateComponent,
    resolve: {
      typeLocalite: TypeLocaliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeLocaliteUpdateComponent,
    resolve: {
      typeLocalite: TypeLocaliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeLocaliteRoute)],
  exports: [RouterModule],
})
export class TypeLocaliteRoutingModule {}
