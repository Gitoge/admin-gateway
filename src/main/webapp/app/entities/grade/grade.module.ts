import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GradeComponent } from './list/grade.component';
import { GradeDetailComponent } from './detail/grade-detail.component';
import { GradeUpdateComponent } from './update/grade-update.component';
import { GradeDeleteDialogComponent } from './delete/grade-delete-dialog.component';
import { GradeRoutingModule } from './route/grade-routing.module';
import { PostesGradeDialogComponent } from './postes_grade/roles_page-dialog.component';

@NgModule({
  imports: [SharedModule, GradeRoutingModule],
  declarations: [GradeComponent, GradeDetailComponent, GradeUpdateComponent, GradeDeleteDialogComponent, PostesGradeDialogComponent],
  entryComponents: [GradeDeleteDialogComponent],
})
export class GradeModule {}
