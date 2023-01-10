import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EnfantComponent } from './list/enfant.component';
import { EnfantDetailComponent } from './detail/enfant-detail.component';
import { EnfantUpdateComponent } from './update/enfant-update.component';
import { EnfantDeleteDialogComponent } from './delete/enfant-delete-dialog.component';
import { EnfantRoutingModule } from './route/enfant-routing.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GrappeFamilialeComponent } from './grappe-familiale/grappe-familiale.component';

@NgModule({
  imports: [SharedModule, EnfantRoutingModule, AutocompleteLibModule],
  declarations: [EnfantComponent, EnfantDetailComponent, EnfantUpdateComponent, GrappeFamilialeComponent, EnfantDeleteDialogComponent],
  entryComponents: [EnfantDeleteDialogComponent],
})
export class CarriereEnfantModule {}
