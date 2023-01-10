import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AugmentationBaremeComponent } from '../list/augmentation-bareme.component';
import { AugmentationBaremeDetailComponent } from '../detail/augmentation-bareme-detail.component';
import { AugmentationBaremeUpdateComponent } from '../update/augmentation-bareme-update.component';
import { AugmentationBaremeRoutingResolveService } from './augmentation-bareme-routing-resolve.service';

const augmentationBaremeRoute: Routes = [
  {
    path: '',
    component: AugmentationBaremeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AugmentationBaremeDetailComponent,
    resolve: {
      augmentationBareme: AugmentationBaremeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AugmentationBaremeUpdateComponent,
    resolve: {
      augmentationBareme: AugmentationBaremeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AugmentationBaremeUpdateComponent,
    resolve: {
      augmentationBareme: AugmentationBaremeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(augmentationBaremeRoute)],
  exports: [RouterModule],
})
export class AugmentationBaremeRoutingModule {}
