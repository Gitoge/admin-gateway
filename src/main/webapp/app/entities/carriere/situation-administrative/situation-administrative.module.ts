import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SituationAdministrativeComponent } from './list/situation-administrative.component';
import { SituationAdministrativeDetailComponent } from './detail/situation-administrative-detail.component';
import { SituationAdministrativeUpdateComponent } from './update/situation-administrative-update.component';
import { SituationAdministrativeDeleteDialogComponent } from './delete/situation-administrative-delete-dialog.component';
import { SituationAdministrativeRoutingModule } from './route/situation-administrative-routing.module';

@NgModule({
  imports: [SharedModule, SituationAdministrativeRoutingModule],
  declarations: [
    SituationAdministrativeComponent,
    SituationAdministrativeDetailComponent,
    SituationAdministrativeUpdateComponent,
    SituationAdministrativeDeleteDialogComponent,
  ],
  entryComponents: [SituationAdministrativeDeleteDialogComponent],
})
export class CarriereSituationAdministrativeModule {}
