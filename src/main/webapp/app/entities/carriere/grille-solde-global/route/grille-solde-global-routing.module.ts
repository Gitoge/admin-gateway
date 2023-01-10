import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrilleSoldeGlobalComponent } from '../list/grille-solde-global.component';
import { GrilleSoldeGlobalRoutingResolveService } from './grille-solde-global-routing-resolve.service';
import { GrilleSoldeGlobalDetailComponent } from '../detail/grille-solde-global-detail.component';
import { GrilleSoldeGlobalUpdateComponent } from '../update/grille-solde-global-update.component';

const grilleSoldeGlobalRoute: Routes = [
  {
    path: '',
    component: GrilleSoldeGlobalComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrilleSoldeGlobalDetailComponent,
    resolve: {
      grilleSoldeGlobal: GrilleSoldeGlobalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrilleSoldeGlobalUpdateComponent,
    resolve: {
      grilleSoldeGlobal: GrilleSoldeGlobalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrilleSoldeGlobalUpdateComponent,
    resolve: {
      grilleSoldeGlobal: GrilleSoldeGlobalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grilleSoldeGlobalRoute)],
  exports: [RouterModule],
})
export class GrilleSoldeGlobalRoutingModule {}
