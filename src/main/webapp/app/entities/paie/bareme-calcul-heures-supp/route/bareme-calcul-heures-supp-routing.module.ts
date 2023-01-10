import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BaremeCalculHeuresSuppComponent } from '../list/bareme-calcul-heures-supp.component';
import { BaremeCalculHeuresSuppDetailComponent } from '../detail/bareme-calcul-heures-supp-detail.component';
import { BaremeCalculHeuresSuppUpdateComponent } from '../update/bareme-calcul-heures-supp-update.component';
import { BaremeCalculHeuresSuppRoutingResolveService } from './bareme-calcul-heures-supp-routing-resolve.service';

const baremeCalculHeuresSuppRoute: Routes = [
  {
    path: '',
    component: BaremeCalculHeuresSuppComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BaremeCalculHeuresSuppDetailComponent,
    resolve: {
      baremeCalculHeuresSupp: BaremeCalculHeuresSuppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BaremeCalculHeuresSuppUpdateComponent,
    resolve: {
      baremeCalculHeuresSupp: BaremeCalculHeuresSuppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BaremeCalculHeuresSuppUpdateComponent,
    resolve: {
      baremeCalculHeuresSupp: BaremeCalculHeuresSuppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(baremeCalculHeuresSuppRoute)],
  exports: [RouterModule],
})
export class BaremeCalculHeuresSuppRoutingModule {}
