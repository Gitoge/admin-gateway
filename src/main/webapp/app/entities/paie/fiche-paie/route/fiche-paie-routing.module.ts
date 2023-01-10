import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FichePaieComponent } from '../list/fiche-paie.component';
import { FichePaieDetailComponent } from '../detail/fiche-paie-detail.component';
import { FichePaieUpdateComponent } from '../update/fiche-paie-update.component';
import { FichePaieRoutingResolveService } from './fiche-paie-routing-resolve.service';
import { FichePaieVisualiserComponent } from '../visualiser/fiche-paie.component';
import { StatistiqueComponent } from '../statistique/fiche-paie.component';

const fichePaieRoute: Routes = [
  {
    path: '',
    component: FichePaieComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'visualiser',
    component: FichePaieVisualiserComponent,
    resolve: {
      fichePaie: FichePaieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'statistique',
    component: StatistiqueComponent,
    resolve: {
      fichePaie: FichePaieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FichePaieDetailComponent,
    resolve: {
      fichePaie: FichePaieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FichePaieUpdateComponent,
    resolve: {
      fichePaie: FichePaieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FichePaieUpdateComponent,
    resolve: {
      fichePaie: FichePaieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fichePaieRoute)],
  exports: [RouterModule],
})
export class FichePaieRoutingModule {}
