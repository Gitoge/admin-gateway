import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExerciceComponent } from './list/exercice.component';
import { ExerciceDetailComponent } from './detail/exercice-detail.component';
import { ExerciceUpdateComponent } from './update/exercice-update.component';
import { ExerciceDeleteDialogComponent } from './delete/exercice-delete-dialog.component';
import { ExerciceRoutingModule } from './route/exercice-routing.module';

@NgModule({
  imports: [SharedModule, ExerciceRoutingModule],
  declarations: [ExerciceComponent, ExerciceDetailComponent, ExerciceUpdateComponent, ExerciceDeleteDialogComponent],
  entryComponents: [ExerciceDeleteDialogComponent],
})
export class PaieExerciceModule {}
