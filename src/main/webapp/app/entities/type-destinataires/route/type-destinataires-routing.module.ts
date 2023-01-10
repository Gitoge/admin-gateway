import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeDestinatairesComponent } from '../list/type-destinataires.component';
import { TypeDestinatairesDetailComponent } from '../detail/type-destinataires-detail.component';
import { TypeDestinatairesUpdateComponent } from '../update/type-destinataires-update.component';
import { TypeDestinatairesRoutingResolveService } from './type-destinataires-routing-resolve.service';

const typeDestinatairesRoute: Routes = [
  {
    path: '',
    component: TypeDestinatairesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeDestinatairesDetailComponent,
    resolve: {
      typeDestinataires: TypeDestinatairesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeDestinatairesUpdateComponent,
    resolve: {
      typeDestinataires: TypeDestinatairesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeDestinatairesUpdateComponent,
    resolve: {
      typeDestinataires: TypeDestinatairesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeDestinatairesRoute)],
  exports: [RouterModule],
})
export class TypeDestinatairesRoutingModule {}
