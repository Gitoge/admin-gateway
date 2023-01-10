import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SaisieEmolumentsComponent } from '../list/saisie-emoluments.component';
import { SaisieEmolumentsDetailComponent } from '../detail/saisie-emoluments-detail.component';
import { SaisieEmolumentsUpdateComponent } from '../update/saisie-emoluments-update.component';
import { SaisieEmolumentsRoutingResolveService } from './saisie-emoluments-routing-resolve.service';

const saisieEmolumentsRoute: Routes = [
  {
    path: '',
    component: SaisieEmolumentsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SaisieEmolumentsDetailComponent,
    resolve: {
      saisieEmoluments: SaisieEmolumentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SaisieEmolumentsUpdateComponent,
    resolve: {
      saisieEmoluments: SaisieEmolumentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SaisieEmolumentsUpdateComponent,
    resolve: {
      saisieEmoluments: SaisieEmolumentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(saisieEmolumentsRoute)],
  exports: [RouterModule],
})
export class SaisieEmolumentsRoutingModule {}
