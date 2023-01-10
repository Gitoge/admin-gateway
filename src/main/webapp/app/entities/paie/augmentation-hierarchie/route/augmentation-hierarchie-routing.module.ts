import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AugmentationHierarchieComponent } from '../list/augmentation-hierarchie.component';
import { AugmentationHierarchieDetailComponent } from '../detail/augmentation-hierarchie-detail.component';
import { AugmentationHierarchieUpdateComponent } from '../update/augmentation-hierarchie-update.component';
import { AugmentationHierarchieRoutingResolveService } from './augmentation-hierarchie-routing-resolve.service';

const augmentationHierarchieRoute: Routes = [
  {
    path: '',
    component: AugmentationHierarchieComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AugmentationHierarchieDetailComponent,
    resolve: {
      augmentationHierarchie: AugmentationHierarchieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AugmentationHierarchieUpdateComponent,
    resolve: {
      augmentationHierarchie: AugmentationHierarchieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AugmentationHierarchieUpdateComponent,
    resolve: {
      augmentationHierarchie: AugmentationHierarchieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(augmentationHierarchieRoute)],
  exports: [RouterModule],
})
export class AugmentationHierarchieRoutingModule {}
