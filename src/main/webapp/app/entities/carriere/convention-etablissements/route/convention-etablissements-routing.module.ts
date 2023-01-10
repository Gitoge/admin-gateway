import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConventionEtablissementsComponent } from '../list/convention-etablissements.component';
import { ConventionEtablissementsDetailComponent } from '../detail/convention-etablissements-detail.component';
import { ConventionEtablissementsUpdateComponent } from '../update/convention-etablissements-update.component';
import { ConventionEtablissementsRoutingResolveService } from './convention-etablissements-routing-resolve.service';

const conventionEtablissementsRoute: Routes = [
  {
    path: '',
    component: ConventionEtablissementsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConventionEtablissementsDetailComponent,
    resolve: {
      conventionEtablissements: ConventionEtablissementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConventionEtablissementsUpdateComponent,
    resolve: {
      conventionEtablissements: ConventionEtablissementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConventionEtablissementsUpdateComponent,
    resolve: {
      conventionEtablissements: ConventionEtablissementsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(conventionEtablissementsRoute)],
  exports: [RouterModule],
})
export class ConventionEtablissementsRoutingModule {}
