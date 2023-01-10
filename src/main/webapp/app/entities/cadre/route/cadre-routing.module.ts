import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CadreComponent } from '../list/cadre.component';
import { CadreDetailComponent } from '../detail/cadre-detail.component';
import { CadreUpdateComponent } from '../update/cadre-update.component';
import { CadreRoutingResolveService } from './cadre-routing-resolve.service';

const cadreRoute: Routes = [
  {
    path: '',
    component: CadreComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CadreDetailComponent,
    resolve: {
      cadre: CadreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CadreUpdateComponent,
    resolve: {
      cadre: CadreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CadreUpdateComponent,
    resolve: {
      cadre: CadreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cadreRoute)],
  exports: [RouterModule],
})
export class CadreRoutingModule {}
