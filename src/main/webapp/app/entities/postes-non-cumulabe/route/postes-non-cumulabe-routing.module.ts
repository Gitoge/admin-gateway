import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostesNonCumulabeComponent } from '../list/postes-non-cumulabe.component';
import { PostesNonCumulabeDetailComponent } from '../detail/postes-non-cumulabe-detail.component';
import { PostesNonCumulabeUpdateComponent } from '../update/postes-non-cumulabe-update.component';
import { PostesNonCumulabeRoutingResolveService } from './postes-non-cumulabe-routing-resolve.service';

const postesNonCumulabeRoute: Routes = [
  {
    path: '',
    component: PostesNonCumulabeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PostesNonCumulabeDetailComponent,
    resolve: {
      postesNonCumulabe: PostesNonCumulabeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PostesNonCumulabeUpdateComponent,
    resolve: {
      postesNonCumulabe: PostesNonCumulabeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostesNonCumulabeUpdateComponent,
    resolve: {
      postesNonCumulabe: PostesNonCumulabeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(postesNonCumulabeRoute)],
  exports: [RouterModule],
})
export class PostesNonCumulabeRoutingModule {}
