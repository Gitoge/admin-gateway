import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeGrilleComponent } from '../list/type-grille.component';
import { TypeGrilleDetailComponent } from '../detail/type-grille-detail.component';
import { TypeGrilleUpdateComponent } from '../update/type-grille-update.component';
import { TypeGrilleRoutingResolveService } from './type-grille-routing-resolve.service';

const typeGrilleRoute: Routes = [
  {
    path: '',
    component: TypeGrilleComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeGrilleDetailComponent,
    resolve: {
      typeGrille: TypeGrilleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeGrilleUpdateComponent,
    resolve: {
      typeGrille: TypeGrilleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeGrilleUpdateComponent,
    resolve: {
      typeGrille: TypeGrilleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeGrilleRoute)],
  exports: [RouterModule],
})
export class TypeGrilleRoutingModule {}
