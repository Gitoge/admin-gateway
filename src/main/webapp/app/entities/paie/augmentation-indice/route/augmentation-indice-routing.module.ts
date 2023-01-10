import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AugmentationIndiceComponent } from '../list/augmentation-indice.component';
import { AugmentationIndiceDetailComponent } from '../detail/augmentation-indice-detail.component';
import { AugmentationIndiceUpdateComponent } from '../update/augmentation-indice-update.component';
import { AugmentationIndiceRoutingResolveService } from './augmentation-indice-routing-resolve.service';

const augmentationIndiceRoute: Routes = [
  {
    path: '',
    component: AugmentationIndiceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AugmentationIndiceDetailComponent,
    resolve: {
      augmentationIndice: AugmentationIndiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AugmentationIndiceUpdateComponent,
    resolve: {
      augmentationIndice: AugmentationIndiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AugmentationIndiceUpdateComponent,
    resolve: {
      augmentationIndice: AugmentationIndiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(augmentationIndiceRoute)],
  exports: [RouterModule],
})
export class AugmentationIndiceRoutingModule {}
