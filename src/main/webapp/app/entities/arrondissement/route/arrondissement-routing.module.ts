import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArrondissementComponent } from '../list/arrondissement.component';
import { ArrondissementDetailComponent } from '../detail/arrondissement-detail.component';
import { ArrondissementUpdateComponent } from '../update/arrondissement-update.component';
import { ArrondissementRoutingResolveService } from './arrondissement-routing-resolve.service';

const arrondissementRoute: Routes = [
  {
    path: '',
    component: ArrondissementComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArrondissementDetailComponent,
    resolve: {
      arrondissement: ArrondissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArrondissementUpdateComponent,
    resolve: {
      arrondissement: ArrondissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArrondissementUpdateComponent,
    resolve: {
      arrondissement: ArrondissementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(arrondissementRoute)],
  exports: [RouterModule],
})
export class ArrondissementRoutingModule {}
