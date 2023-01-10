import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeEtablissementComponent } from '../list/type-etablissement.component';
import { TypeEtablissementDetailComponent } from '../detail/type-etablissement-detail.component';
import { TypeEtablissementUpdateComponent } from '../update/type-etablissement-update.component';
import { TypeEtablissementRoutingResolveService } from './type-etablissement-routing-resolve.service';

const typeEtablissementRoute: Routes = [
  {
    path: '',
    component: TypeEtablissementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeEtablissementDetailComponent,
    resolve: {
      typeEtablissement: TypeEtablissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeEtablissementUpdateComponent,
    resolve: {
      typeEtablissement: TypeEtablissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeEtablissementUpdateComponent,
    resolve: {
      typeEtablissement: TypeEtablissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeEtablissementRoute)],
  exports: [RouterModule],
})
export class TypeEtablissementRoutingModule {}
