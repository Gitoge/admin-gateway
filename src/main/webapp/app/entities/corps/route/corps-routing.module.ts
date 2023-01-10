import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CorpsComponent } from '../list/corps.component';
import { CorpsDetailComponent } from '../detail/corps-detail.component';
import { CorpsUpdateComponent } from '../update/corps-update.component';
import { CorpsRoutingResolveService } from './corps-routing-resolve.service';

const corpsRoute: Routes = [
  {
    path: '',
    component: CorpsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CorpsDetailComponent,
    resolve: {
      corps: CorpsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CorpsUpdateComponent,
    resolve: {
      corps: CorpsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CorpsUpdateComponent,
    resolve: {
      corps: CorpsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(corpsRoute)],
  exports: [RouterModule],
})
export class CorpsRoutingModule {}
