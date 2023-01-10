import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmolumentsComponent } from '../list/emoluments.component';
import { EmolumentsDetailComponent } from '../detail/emoluments-detail.component';
import { EmolumentsUpdateComponent } from '../update/emoluments-update.component';
import { EmolumentsRoutingResolveService } from './emoluments-routing-resolve.service';

const emolumentsRoute: Routes = [
  {
    path: '',
    component: EmolumentsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmolumentsDetailComponent,
    resolve: {
      emoluments: EmolumentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmolumentsUpdateComponent,
    resolve: {
      emoluments: EmolumentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmolumentsUpdateComponent,
    resolve: {
      emoluments: EmolumentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emolumentsRoute)],
  exports: [RouterModule],
})
export class EmolumentsRoutingModule {}
