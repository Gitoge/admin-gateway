import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActesComponent } from './list/actes.component';
import { ActesDetailComponent } from './detail/actes-detail.component';
import { ActesUpdateComponent } from './update/actes-update.component';
import { ActesDeleteDialogComponent } from './delete/actes-delete-dialog.component';
import { ActesRoutingModule } from './route/actes-routing.module';

@NgModule({
  imports: [SharedModule, ActesRoutingModule],
  declarations: [ActesComponent, ActesDetailComponent, ActesUpdateComponent, ActesDeleteDialogComponent],
  entryComponents: [ActesDeleteDialogComponent],
})
export class CarriereActesModule {}
