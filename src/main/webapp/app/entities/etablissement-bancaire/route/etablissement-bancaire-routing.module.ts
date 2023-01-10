import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EtablissementBancaireComponent } from '../list/etablissement-bancaire.component';
import { EtablissementBancaireDetailComponent } from '../detail/etablissement-bancaire-detail.component';
import { EtablissementBancaireUpdateComponent } from '../update/etablissement-bancaire-update.component';
import { EtablissementBancaireRoutingResolveService } from './etablissement-bancaire-routing-resolve.service';

const etablissementBancaireRoute: Routes = [
  {
    path: '',
    component: EtablissementBancaireComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtablissementBancaireDetailComponent,
    resolve: {
      etablissementBancaire: EtablissementBancaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtablissementBancaireUpdateComponent,
    resolve: {
      etablissementBancaire: EtablissementBancaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtablissementBancaireUpdateComponent,
    resolve: {
      etablissementBancaire: EtablissementBancaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(etablissementBancaireRoute)],
  exports: [RouterModule],
})
export class EtablissementBancaireRoutingModule {}
