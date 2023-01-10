import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PosteCompoGradeComponent } from './list/poste-compo-grade.component';
import { PosteCompoGradeDetailComponent } from './detail/poste-compo-grade-detail.component';
import { PosteCompoGradeUpdateComponent } from './update/poste-compo-grade-update.component';
import { PosteCompoGradeDeleteDialogComponent } from './delete/poste-compo-grade-delete-dialog.component';
import { PosteCompoGradeRoutingModule } from './route/poste-compo-grade-routing.module';

@NgModule({
  imports: [SharedModule, PosteCompoGradeRoutingModule],
  declarations: [
    PosteCompoGradeComponent,
    PosteCompoGradeDetailComponent,
    PosteCompoGradeUpdateComponent,
    PosteCompoGradeDeleteDialogComponent,
  ],
  entryComponents: [PosteCompoGradeDeleteDialogComponent],
})
export class PosteCompoGradeModule {}
