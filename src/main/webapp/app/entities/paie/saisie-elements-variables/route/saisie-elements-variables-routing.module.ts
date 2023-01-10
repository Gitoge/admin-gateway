import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SaisieElementsVariablesComponent } from '../list/saisie-elements-variables.component';
import { SaisieElementsVariablesDetailComponent } from '../detail/saisie-elements-variables-detail.component';
import { SaisieElementsVariablesUpdateComponent } from '../update/saisie-elements-variables-update.component';
import { SaisieElementsVariablesRoutingResolveService } from './saisie-elements-variables-routing-resolve.service';
import { SaisieElementsVariablesUpdateSelComponent } from '../updatesel/saisie-elements-variables-update.component';

const saisieElementsVariablesRoute: Routes = [
  {
    path: 'list',
    component: SaisieElementsVariablesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SaisieElementsVariablesDetailComponent,
    resolve: {
      saisieElementsVariables: SaisieElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/edit',
    component: SaisieElementsVariablesUpdateSelComponent,
    resolve: {
      saisieElementsVariables: SaisieElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: 'new',
    component: SaisieElementsVariablesUpdateComponent,
    resolve: {
      saisieElementsVariables: SaisieElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: '',
    component: SaisieElementsVariablesUpdateComponent,
    resolve: {
      saisieElementsVariables: SaisieElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(saisieElementsVariablesRoute)],
  exports: [RouterModule],
})
export class SaisieElementsVariablesRoutingModule {}
