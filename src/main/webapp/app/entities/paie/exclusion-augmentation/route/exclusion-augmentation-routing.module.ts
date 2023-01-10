import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExclusionAugmentationComponent } from '../list/exclusion-augmentation.component';
import { ExclusionAugmentationDetailComponent } from '../detail/exclusion-augmentation-detail.component';
import { ExclusionAugmentationUpdateComponent } from '../update/exclusion-augmentation-update.component';
import { ExclusionAugmentationRoutingResolveService } from './exclusion-augmentation-routing-resolve.service';

const exclusionAugmentationRoute: Routes = [
  {
    path: '',
    component: ExclusionAugmentationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExclusionAugmentationDetailComponent,
    resolve: {
      exclusionAugmentation: ExclusionAugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExclusionAugmentationUpdateComponent,
    resolve: {
      exclusionAugmentation: ExclusionAugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExclusionAugmentationUpdateComponent,
    resolve: {
      exclusionAugmentation: ExclusionAugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exclusionAugmentationRoute)],
  exports: [RouterModule],
})
export class ExclusionAugmentationRoutingModule {}
