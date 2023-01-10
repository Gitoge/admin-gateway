import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistoAugmentationComponent } from '../list/histo-augmentation.component';
import { HistoAugmentationDetailComponent } from '../detail/histo-augmentation-detail.component';
import { HistoAugmentationUpdateComponent } from '../update/histo-augmentation-update.component';
import { HistoAugmentationRoutingResolveService } from './histo-augmentation-routing-resolve.service';

const histoAugmentationRoute: Routes = [
  {
    path: '',
    component: HistoAugmentationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoAugmentationDetailComponent,
    resolve: {
      histoAugmentation: HistoAugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoAugmentationUpdateComponent,
    resolve: {
      histoAugmentation: HistoAugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoAugmentationUpdateComponent,
    resolve: {
      histoAugmentation: HistoAugmentationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(histoAugmentationRoute)],
  exports: [RouterModule],
})
export class HistoAugmentationRoutingModule {}
