import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfilsComponent } from '../list/profils.component';
import { ProfilsDetailComponent } from '../detail/profils-detail.component';
import { ProfilsUpdateComponent } from '../update/profils-update.component';
import { ProfilsRoutingResolveService } from './profils-routing-resolve.service';

const profilsRoute: Routes = [
  {
    path: '',
    component: ProfilsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfilsDetailComponent,
    resolve: {
      profils: ProfilsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfilsUpdateComponent,
    resolve: {
      profils: ProfilsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfilsUpdateComponent,
    resolve: {
      profils: ProfilsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profilsRoute)],
  exports: [RouterModule],
})
export class ProfilsRoutingModule {}
