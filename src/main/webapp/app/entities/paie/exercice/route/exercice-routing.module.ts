import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExerciceComponent } from '../list/exercice.component';
import { ExerciceDetailComponent } from '../detail/exercice-detail.component';
import { ExerciceUpdateComponent } from '../update/exercice-update.component';
import { ExerciceRoutingResolveService } from './exercice-routing-resolve.service';

const exerciceRoute: Routes = [
  {
    path: '',
    component: ExerciceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExerciceDetailComponent,
    resolve: {
      exercice: ExerciceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExerciceUpdateComponent,
    resolve: {
      exercice: ExerciceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExerciceUpdateComponent,
    resolve: {
      exercice: ExerciceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exerciceRoute)],
  exports: [RouterModule],
})
export class ExerciceRoutingModule {}
