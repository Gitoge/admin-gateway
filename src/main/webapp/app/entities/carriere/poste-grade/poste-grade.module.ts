import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PosteGradeComponent } from './list/poste-grade.component';
import { PosteGradeDetailComponent } from './detail/poste-grade-detail.component';
import { PosteGradeUpdateComponent } from './update/poste-grade-update.component';
import { PosteGradeDeleteDialogComponent } from './delete/poste-grade-delete-dialog.component';
import { PosteGradeRoutingModule } from './route/poste-grade-routing.module';

@NgModule({
  imports: [SharedModule, PosteGradeRoutingModule],
  declarations: [PosteGradeComponent, PosteGradeDetailComponent, PosteGradeUpdateComponent, PosteGradeDeleteDialogComponent],
  entryComponents: [PosteGradeDeleteDialogComponent],
})
export class PosteGradeModule {}
