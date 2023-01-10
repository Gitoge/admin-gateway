import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostesReferenceActesComponent } from '../list/postes-reference-actes.component';
import { PostesReferenceActesDetailComponent } from '../detail/postes-reference-actes-detail.component';
import { PostesReferenceActesUpdateComponent } from '../update/postes-reference-actes-update.component';
import { PostesReferenceActesRoutingResolveService } from './postes-reference-actes-routing-resolve.service';

const postesReferenceActesRoute: Routes = [
  {
    path: '',
    component: PostesReferenceActesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PostesReferenceActesDetailComponent,
    resolve: {
      postesReferenceActes: PostesReferenceActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PostesReferenceActesUpdateComponent,
    resolve: {
      postesReferenceActes: PostesReferenceActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostesReferenceActesUpdateComponent,
    resolve: {
      postesReferenceActes: PostesReferenceActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(postesReferenceActesRoute)],
  exports: [RouterModule],
})
export class PostesReferenceActesRoutingModule {}
