import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PriseEnCompteComponent } from '../list/prise-en-compte.component';
import { PriseEnCompteDetailComponent } from '../detail/prise-en-compte-detail.component';
import { PriseEnCompteUpdateComponent } from '../update/prise-en-compte-update.component';
import { PriseEnCompteRoutingResolveService } from './prise-en-compte-routing-resolve.service';
import { PriseEnCompteSlideUpdateComponent } from '../update-slide/prise-en-compte-slide-update.component';
import { ListPriseEnCompteComponent } from '../modification/list-prise-en-compte.component';
import { PriseEnCompteModifComponent } from '../prise-en-compte-update/prise-en-compte-modifi.component';

const priseEncompteRoute: Routes = [
  {
    path: '',
    component: PriseEnCompteComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PriseEnCompteDetailComponent,
    resolve: {
      priseEncompte: PriseEnCompteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'slide',
    component: PriseEnCompteUpdateComponent,
    resolve: {
      priseEncompte: PriseEnCompteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'list',
    component: ListPriseEnCompteComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PriseEnCompteSlideUpdateComponent,
    resolve: {
      priseEncompte: PriseEnCompteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PriseEnCompteModifComponent,
    resolve: {
      priseEncompte: PriseEnCompteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: ':id/edit',
  //   component: PriseEnCompteUpdateComponent,
  //   resolve: {
  //     priseEncompte: PriseEnCompteRoutingResolveService,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(priseEncompteRoute)],
  exports: [RouterModule],
})
export class PriseEnCompteRoutingModule {}
