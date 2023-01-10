import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PostesReferenceActesComponent } from './list/postes-reference-actes.component';
import { PostesReferenceActesDetailComponent } from './detail/postes-reference-actes-detail.component';
import { PostesReferenceActesUpdateComponent } from './update/postes-reference-actes-update.component';
import { PostesReferenceActesDeleteDialogComponent } from './delete/postes-reference-actes-delete-dialog.component';
import { PostesReferenceActesRoutingModule } from './route/postes-reference-actes-routing.module';

@NgModule({
  imports: [SharedModule, PostesReferenceActesRoutingModule],
  declarations: [
    PostesReferenceActesComponent,
    PostesReferenceActesDetailComponent,
    PostesReferenceActesUpdateComponent,
    PostesReferenceActesDeleteDialogComponent,
  ],
  entryComponents: [PostesReferenceActesDeleteDialogComponent],
})
export class PostesReferenceActesModule {}
