import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PositionsAgentComponent } from '../list/positions-agent.component';
import { PositionsAgentDetailComponent } from '../detail/positions-agent-detail.component';
import { PositionsAgentUpdateComponent } from '../update/positions-agent-update.component';
import { PositionsAgentRoutingResolveService } from './positions-agent-routing-resolve.service';

const positionsAgentRoute: Routes = [
  {
    path: '',
    component: PositionsAgentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionsAgentDetailComponent,
    resolve: {
      positionsAgent: PositionsAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionsAgentUpdateComponent,
    resolve: {
      positionsAgent: PositionsAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionsAgentUpdateComponent,
    resolve: {
      positionsAgent: PositionsAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(positionsAgentRoute)],
  exports: [RouterModule],
})
export class PositionsAgentRoutingModule {}
