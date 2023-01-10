import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NatureActesComponent } from '../list/nature-actes.component';
import { NatureActesDetailComponent } from '../detail/nature-actes-detail.component';
import { NatureActesUpdateComponent } from '../update/nature-actes-update.component';
import { NatureActesRoutingResolveService } from './nature-actes-routing-resolve.service';

const natureActesRoute: Routes = [
  {
    path: '',
    component: NatureActesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NatureActesDetailComponent,
    resolve: {
      natureActes: NatureActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NatureActesUpdateComponent,
    resolve: {
      natureActes: NatureActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NatureActesUpdateComponent,
    resolve: {
      natureActes: NatureActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(natureActesRoute)],
  exports: [RouterModule],
})
export class NatureActesRoutingModule {}
