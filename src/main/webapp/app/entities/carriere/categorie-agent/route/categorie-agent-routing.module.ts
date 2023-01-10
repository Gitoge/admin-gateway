import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CategorieAgentComponent } from '../list/categorie-agent.component';
import { CategorieAgentDetailComponent } from '../detail/categorie-agent-detail.component';
import { CategorieAgentUpdateComponent } from '../update/categorie-agent-update.component';
import { CategorieAgentRoutingResolveService } from './categorie-agent-routing-resolve.service';

const categorieAgentRoute: Routes = [
  {
    path: '',
    component: CategorieAgentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CategorieAgentDetailComponent,
    resolve: {
      categorieAgent: CategorieAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CategorieAgentUpdateComponent,
    resolve: {
      categorieAgent: CategorieAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CategorieAgentUpdateComponent,
    resolve: {
      categorieAgent: CategorieAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(categorieAgentRoute)],
  exports: [RouterModule],
})
export class CategorieAgentRoutingModule {}
