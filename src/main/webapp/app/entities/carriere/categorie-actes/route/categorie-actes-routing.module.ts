import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CategorieActesComponent } from '../list/categorie-actes.component';
import { CategorieActesDetailComponent } from '../detail/categorie-actes-detail.component';
import { CategorieActesUpdateComponent } from '../update/categorie-actes-update.component';
import { CategorieActesRoutingResolveService } from './categorie-actes-routing-resolve.service';

const categorieActesRoute: Routes = [
  {
    path: '',
    component: CategorieActesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CategorieActesDetailComponent,
    resolve: {
      categorieActes: CategorieActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CategorieActesUpdateComponent,
    resolve: {
      categorieActes: CategorieActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CategorieActesUpdateComponent,
    resolve: {
      categorieActes: CategorieActesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(categorieActesRoute)],
  exports: [RouterModule],
})
export class CategorieActesRoutingModule {}
