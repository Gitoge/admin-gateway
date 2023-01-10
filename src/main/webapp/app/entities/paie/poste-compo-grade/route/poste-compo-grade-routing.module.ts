import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PosteCompoGradeComponent } from '../list/poste-compo-grade.component';
import { PosteCompoGradeDetailComponent } from '../detail/poste-compo-grade-detail.component';
import { PosteCompoGradeUpdateComponent } from '../update/poste-compo-grade-update.component';
import { PosteCompoGradeRoutingResolveService } from './poste-compo-grade-routing-resolve.service';

const posteCompoGradeRoute: Routes = [
  {
    path: '',
    component: PosteCompoGradeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PosteCompoGradeDetailComponent,
    resolve: {
      posteCompoGrade: PosteCompoGradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PosteCompoGradeUpdateComponent,
    resolve: {
      posteCompoGrade: PosteCompoGradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PosteCompoGradeUpdateComponent,
    resolve: {
      posteCompoGrade: PosteCompoGradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(posteCompoGradeRoute)],
  exports: [RouterModule],
})
export class PosteCompoGradeRoutingModule {}
