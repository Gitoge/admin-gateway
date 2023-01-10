import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HierarchieComponent } from '../list/hierarchie.component';
import { HierarchieDetailComponent } from '../detail/hierarchie-detail.component';
import { HierarchieUpdateComponent } from '../update/hierarchie-update.component';
import { HierarchieRoutingResolveService } from './hierarchie-routing-resolve.service';

const hierarchieRoute: Routes = [
  {
    path: '',
    component: HierarchieComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HierarchieDetailComponent,
    resolve: {
      hierarchie: HierarchieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HierarchieUpdateComponent,
    resolve: {
      hierarchie: HierarchieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HierarchieUpdateComponent,
    resolve: {
      hierarchie: HierarchieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hierarchieRoute)],
  exports: [RouterModule],
})
export class HierarchieRoutingModule {}
