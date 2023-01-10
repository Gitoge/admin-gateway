import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PosteGradeComponent } from '../list/poste-grade.component';
import { PosteGradeDetailComponent } from '../detail/poste-grade-detail.component';
import { PosteGradeUpdateComponent } from '../update/poste-grade-update.component';
import { PosteGradeRoutingResolveService } from './poste-grade-routing-resolve.service';

const posteGradeRoute: Routes = [
  {
    path: '',
    component: PosteGradeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PosteGradeDetailComponent,
    resolve: {
      posteGrade: PosteGradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PosteGradeUpdateComponent,
    resolve: {
      posteGrade: PosteGradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PosteGradeUpdateComponent,
    resolve: {
      posteGrade: PosteGradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(posteGradeRoute)],
  exports: [RouterModule],
})
export class PosteGradeRoutingModule {}
