import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocumentAdministratifComponent } from '../list/document-administratif.component';
import { DocumentAdministratifDetailComponent } from '../detail/document-administratif-detail.component';
import { DocumentAdministratifUpdateComponent } from '../update/document-administratif-update.component';
import { DocumentAdministratifRoutingResolveService } from './document-administratif-routing-resolve.service';

const documentAdministratifRoute: Routes = [
  {
    path: '',
    component: DocumentAdministratifComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentAdministratifDetailComponent,
    resolve: {
      documentAdministratif: DocumentAdministratifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentAdministratifUpdateComponent,
    resolve: {
      documentAdministratif: DocumentAdministratifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentAdministratifUpdateComponent,
    resolve: {
      documentAdministratif: DocumentAdministratifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(documentAdministratifRoute)],
  exports: [RouterModule],
})
export class DocumentAdministratifRoutingModule {}
