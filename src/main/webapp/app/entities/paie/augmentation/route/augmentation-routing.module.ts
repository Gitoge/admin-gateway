import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AugmentationComponent } from '../list/augmentation.component';
import { AugmentationDetailComponent } from '../detail/augmentation-detail.component';
import { AugmentationUpdateComponent } from '../update/augmentation-update.component';
import { AugmentationRoutingResolveService } from './augmentation-routing-resolve.service';

const augmentationRoute: Routes = [
  {
    path: '',
    component: AugmentationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AugmentationDetailComponent,
    resolve: {
      augmentation: AugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AugmentationUpdateComponent,
    resolve: {
      augmentation: AugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AugmentationUpdateComponent,
    resolve: {
      augmentation: AugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(augmentationRoute)],
  exports: [RouterModule],
})
export class AugmentationRoutingModule {}
