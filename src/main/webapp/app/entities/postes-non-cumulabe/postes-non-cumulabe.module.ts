import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PostesNonCumulabeComponent } from './list/postes-non-cumulabe.component';
import { PostesNonCumulabeDetailComponent } from './detail/postes-non-cumulabe-detail.component';
import { PostesNonCumulabeUpdateComponent } from './update/postes-non-cumulabe-update.component';
import { PostesNonCumulabeDeleteDialogComponent } from './delete/postes-non-cumulabe-delete-dialog.component';
import { PostesNonCumulabeRoutingModule } from './route/postes-non-cumulabe-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, PostesNonCumulabeRoutingModule, ReactiveFormsModule],
  declarations: [
    PostesNonCumulabeComponent,
    PostesNonCumulabeDetailComponent,
    PostesNonCumulabeUpdateComponent,
    PostesNonCumulabeDeleteDialogComponent,
  ],
  entryComponents: [PostesNonCumulabeDeleteDialogComponent],
})
export class PostesNonCumulabeModule {}
