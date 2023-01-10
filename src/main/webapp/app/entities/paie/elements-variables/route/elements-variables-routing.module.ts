import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ElementsVariablesComponent } from '../list/elements-variables.component';
import { ElementsVariablesDetailComponent } from '../detail/elements-variables-detail.component';
import { ElementsVariablesUpdateComponent } from '../update/elements-variables-update.component';
import { ElementsVariablesRoutingResolveService } from './elements-variables-routing-resolve.service';

const elementsVariablesRoute: Routes = [
  {
    path: '',
    component: ElementsVariablesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ElementsVariablesDetailComponent,
    resolve: {
      elementsVariables: ElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ElementsVariablesUpdateComponent,
    resolve: {
      elementsVariables: ElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ElementsVariablesUpdateComponent,
    resolve: {
      elementsVariables: ElementsVariablesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(elementsVariablesRoute)],
  exports: [RouterModule],
})
export class ElementsVariablesRoutingModule {}
