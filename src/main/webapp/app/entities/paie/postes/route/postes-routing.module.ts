import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostesComponent } from '../list/postes.component';
import { PostesDetailComponent } from '../detail/postes-detail.component';
import { PostesUpdateComponent } from '../update/postes-update.component';
import { PostesRoutingResolveService } from './postes-routing-resolve.service';

const postesRoute: Routes = [
  {
    path: '',
    component: PostesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PostesDetailComponent,
    resolve: {
      postes: PostesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PostesUpdateComponent,
    resolve: {
      postes: PostesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostesUpdateComponent,
    resolve: {
      postes: PostesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(postesRoute)],
  exports: [RouterModule],
})
export class PostesRoutingModule {}
