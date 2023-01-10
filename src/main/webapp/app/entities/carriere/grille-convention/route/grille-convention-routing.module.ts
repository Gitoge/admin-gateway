import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrilleConventionComponent } from '../list/grille-convention.component';
import { GrilleConventionDetailComponent } from '../detail/grille-convention-detail.component';
import { GrilleConventionUpdateComponent } from '../update/grille-convention-update.component';
import { GrilleConventionRoutingResolveService } from './grille-convention-routing-resolve.service';

const grilleConventionRoute: Routes = [
  {
    path: '',
    component: GrilleConventionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrilleConventionDetailComponent,
    resolve: {
      grilleConvention: GrilleConventionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrilleConventionUpdateComponent,
    resolve: {
      grilleConvention: GrilleConventionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrilleConventionUpdateComponent,
    resolve: {
      grilleConvention: GrilleConventionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grilleConventionRoute)],
  exports: [RouterModule],
})
export class GrilleConventionRoutingModule {}
