import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParametreComponent } from '../list/parametre.component';
import { ParametreDetailComponent } from '../detail/parametre-detail.component';
import { ParametreUpdateComponent } from '../update/parametre-update.component';
import { ParametreRoutingResolveService } from './parametre-routing-resolve.service';

const parametreRoute: Routes = [
  {
    path: '',
    component: ParametreComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParametreDetailComponent,
    resolve: {
      parametre: ParametreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParametreUpdateComponent,
    resolve: {
      parametre: ParametreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParametreUpdateComponent,
    resolve: {
      parametre: ParametreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parametreRoute)],
  exports: [RouterModule],
})
export class ParametreRoutingModule {}
