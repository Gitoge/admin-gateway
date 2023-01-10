import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NatureActesComponent } from './list/nature-actes.component';
import { NatureActesDetailComponent } from './detail/nature-actes-detail.component';
import { NatureActesUpdateComponent } from './update/nature-actes-update.component';
import { NatureActesDeleteDialogComponent } from './delete/nature-actes-delete-dialog.component';
import { NatureActesRoutingModule } from './route/nature-actes-routing.module';

@NgModule({
  imports: [SharedModule, NatureActesRoutingModule],
  declarations: [NatureActesComponent, NatureActesDetailComponent, NatureActesUpdateComponent, NatureActesDeleteDialogComponent],
  entryComponents: [NatureActesDeleteDialogComponent],
})
export class NatureActesModule {}
