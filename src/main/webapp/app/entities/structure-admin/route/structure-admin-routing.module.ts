import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StructureAdminComponent } from '../list/structure-admin.component';
import { StructureAdminDetailComponent } from '../detail/structure-admin-detail.component';
import { StructureAdminUpdateComponent } from '../update/structure-admin-update.component';
import { StructureAdminRoutingResolveService } from './structure-admin-routing-resolve.service';

const structureAdminRoute: Routes = [
  {
    path: '',
    component: StructureAdminComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StructureAdminDetailComponent,
    resolve: {
      structureAdmin: StructureAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StructureAdminUpdateComponent,
    resolve: {
      structureAdmin: StructureAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StructureAdminUpdateComponent,
    resolve: {
      structureAdmin: StructureAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(structureAdminRoute)],
  exports: [RouterModule],
})
export class StructureAdminRoutingModule {}
