import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PostesComponent } from './list/postes.component';
import { PostesDetailComponent } from './detail/postes-detail.component';
import { PostesUpdateComponent } from './update/postes-update.component';
import { PostesDeleteDialogComponent } from './delete/postes-delete-dialog.component';
import { PostesRoutingModule } from './route/postes-routing.module';

@NgModule({
  imports: [SharedModule, PostesRoutingModule],
  declarations: [PostesComponent, PostesDetailComponent, PostesUpdateComponent, PostesDeleteDialogComponent],
  entryComponents: [PostesDeleteDialogComponent],
})
export class PaiePostesModule {}
