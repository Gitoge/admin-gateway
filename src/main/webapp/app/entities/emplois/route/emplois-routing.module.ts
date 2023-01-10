import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmploisComponent } from '../list/emplois.component';
import { EmploisDetailComponent } from '../detail/emplois-detail.component';
import { EmploisUpdateComponent } from '../update/emplois-update.component';
import { EmploisRoutingResolveService } from './emplois-routing-resolve.service';

const emploisRoute: Routes = [
  {
    path: '',
    component: EmploisComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmploisDetailComponent,
    resolve: {
      emplois: EmploisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmploisUpdateComponent,
    resolve: {
      emplois: EmploisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmploisUpdateComponent,
    resolve: {
      emplois: EmploisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emploisRoute)],
  exports: [RouterModule],
})
export class EmploisRoutingModule {}
