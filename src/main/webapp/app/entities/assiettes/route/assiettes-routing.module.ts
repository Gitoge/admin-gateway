import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AssiettesComponent } from '../list/assiettes.component';
import { AssiettesDetailComponent } from '../detail/assiettes-detail.component';
import { AssiettesUpdateComponent } from '../update/assiettes-update.component';
import { AssiettesRoutingResolveService } from './assiettes-routing-resolve.service';

const assiettesRoute: Routes = [
  {
    path: '',
    component: AssiettesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssiettesDetailComponent,
    resolve: {
      assiettes: AssiettesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssiettesUpdateComponent,
    resolve: {
      assiettes: AssiettesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssiettesUpdateComponent,
    resolve: {
      assiettes: AssiettesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(assiettesRoute)],
  exports: [RouterModule],
})
export class AssiettesRoutingModule {}
