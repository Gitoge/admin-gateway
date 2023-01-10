import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrilleIndiciaireComponent } from '../list/grille-indiciaire.component';
import { GrilleIndiciaireDetailComponent } from '../detail/grille-indiciaire-detail.component';
import { GrilleIndiciaireUpdateComponent } from '../update/grille-indiciaire-update.component';
import { GrilleIndiciaireRoutingResolveService } from './grille-indiciaire-routing-resolve.service';

const grilleIndiciaireRoute: Routes = [
  {
    path: '',
    component: GrilleIndiciaireComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrilleIndiciaireDetailComponent,
    resolve: {
      grilleIndiciaire: GrilleIndiciaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrilleIndiciaireUpdateComponent,
    resolve: {
      grilleIndiciaire: GrilleIndiciaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrilleIndiciaireUpdateComponent,
    resolve: {
      grilleIndiciaire: GrilleIndiciaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grilleIndiciaireRoute)],
  exports: [RouterModule],
})
export class GrilleIndiciaireRoutingModule {}
