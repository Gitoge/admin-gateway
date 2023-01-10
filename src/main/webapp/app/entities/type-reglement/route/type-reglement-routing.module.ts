import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeReglementComponent } from '../list/type-reglement.component';
import { TypeReglementDetailComponent } from '../detail/type-reglement-detail.component';
import { TypeReglementUpdateComponent } from '../update/type-reglement-update.component';
import { TypeReglementRoutingResolveService } from './type-reglement-routing-resolve.service';

const typeReglementRoute: Routes = [
  {
    path: '',
    component: TypeReglementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeReglementDetailComponent,
    resolve: {
      typeReglement: TypeReglementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeReglementUpdateComponent,
    resolve: {
      typeReglement: TypeReglementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeReglementUpdateComponent,
    resolve: {
      typeReglement: TypeReglementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeReglementRoute)],
  exports: [RouterModule],
})
export class TypeReglementRoutingModule {}
