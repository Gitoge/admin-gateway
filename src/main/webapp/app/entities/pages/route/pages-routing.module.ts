import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagesComponent } from '../list/pages.component';
import { PagesDetailComponent } from '../detail/pages-detail.component';
import { PagesUpdateComponent } from '../update/pages-update.component';
import { PagesRoutingResolveService } from './pages-routing-resolve.service';

const pagesRoute: Routes = [
  {
    path: '',
    component: PagesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PagesDetailComponent,
    resolve: {
      pages: PagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PagesUpdateComponent,
    resolve: {
      pages: PagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PagesUpdateComponent,
    resolve: {
      pages: PagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoute)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
