import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HierarchieCategorieComponent } from '../list/hierarchie-categorie.component';
import { HierarchieCategorieDetailComponent } from '../detail/hierarchie-categorie-detail.component';
import { HierarchieCategorieUpdateComponent } from '../update/hierarchie-categorie-update.component';
import { HierarchieCategorieRoutingResolveService } from './hierarchie-categorie-routing-resolve.service';

const hierarchieCategorieRoute: Routes = [
  {
    path: '',
    component: HierarchieCategorieComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HierarchieCategorieDetailComponent,
    resolve: {
      hierarchieCategorie: HierarchieCategorieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HierarchieCategorieUpdateComponent,
    resolve: {
      hierarchieCategorie: HierarchieCategorieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HierarchieCategorieUpdateComponent,
    resolve: {
      hierarchieCategorie: HierarchieCategorieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hierarchieCategorieRoute)],
  exports: [RouterModule],
})
export class HierarchieCategorieRoutingModule {}
