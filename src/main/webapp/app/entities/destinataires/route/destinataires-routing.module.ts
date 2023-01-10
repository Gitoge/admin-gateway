import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DestinatairesComponent } from '../list/destinataires.component';
import { DestinatairesDetailComponent } from '../detail/destinataires-detail.component';
import { DestinatairesUpdateComponent } from '../update/destinataires-update.component';
import { DestinatairesRoutingResolveService } from './destinataires-routing-resolve.service';

const destinatairesRoute: Routes = [
  {
    path: '',
    component: DestinatairesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DestinatairesDetailComponent,
    resolve: {
      destinataires: DestinatairesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DestinatairesUpdateComponent,
    resolve: {
      destinataires: DestinatairesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DestinatairesUpdateComponent,
    resolve: {
      destinataires: DestinatairesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(destinatairesRoute)],
  exports: [RouterModule],
})
export class DestinatairesRoutingModule {}
