import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SituationFamilialeComponent } from './list/situation-familiale.component';
import { SituationFamilialeDetailComponent } from './detail/situation-familiale-detail.component';
import { SituationFamilialeUpdateComponent } from './update/situation-familiale-update.component';
import { SituationFamilialeDeleteDialogComponent } from './delete/situation-familiale-delete-dialog.component';
import { SituationFamilialeRoutingModule } from './route/situation-familiale-routing.module';

@NgModule({
  imports: [SharedModule, SituationFamilialeRoutingModule],
  declarations: [
    SituationFamilialeComponent,
    SituationFamilialeDetailComponent,
    SituationFamilialeUpdateComponent,
    SituationFamilialeDeleteDialogComponent,
  ],
  entryComponents: [SituationFamilialeDeleteDialogComponent],
})
export class CarriereSituationFamilialeModule {}
