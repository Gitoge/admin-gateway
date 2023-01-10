import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ApplicationsComponent } from '../list/applications.component';
import { ApplicationsDetailComponent } from '../detail/applications-detail.component';
import { ApplicationsUpdateComponent } from '../update/applications-update.component';
import { ApplicationsRoutingResolveService } from './applications-routing-resolve.service';

const applicationsRoute: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationsDetailComponent,
    resolve: {
      applications: ApplicationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationsUpdateComponent,
    resolve: {
      applications: ApplicationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationsUpdateComponent,
    resolve: {
      applications: ApplicationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(applicationsRoute)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
