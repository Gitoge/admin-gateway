import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiplomesComponent } from '../list/diplomes.component';
import { DiplomesDetailComponent } from '../detail/diplomes-detail.component';
import { DiplomesUpdateComponent } from '../update/diplomes-update.component';
import { DiplomesRoutingResolveService } from './diplomes-routing-resolve.service';

const diplomesRoute: Routes = [
  {
    path: '',
    component: DiplomesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiplomesDetailComponent,
    resolve: {
      diplomes: DiplomesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiplomesUpdateComponent,
    resolve: {
      diplomes: DiplomesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiplomesUpdateComponent,
    resolve: {
      diplomes: DiplomesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(diplomesRoute)],
  exports: [RouterModule],
})
export class DiplomesRoutingModule {}
