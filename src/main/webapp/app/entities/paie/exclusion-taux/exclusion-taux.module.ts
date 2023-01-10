import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExclusionTauxComponent } from './list/exclusion-taux.component';
import { ExclusionTauxDetailComponent } from './detail/exclusion-taux-detail.component';
import { ExclusionTauxUpdateComponent } from './update/exclusion-taux-update.component';
import { ExclusionTauxDeleteDialogComponent } from './delete/exclusion-taux-delete-dialog.component';
import { ExclusionTauxRoutingModule } from './route/exclusion-taux-routing.module';

@NgModule({
  imports: [SharedModule, ExclusionTauxRoutingModule],
  declarations: [ExclusionTauxComponent, ExclusionTauxDetailComponent, ExclusionTauxUpdateComponent, ExclusionTauxDeleteDialogComponent],
  entryComponents: [ExclusionTauxDeleteDialogComponent],
})
export class ExclusionTauxModule {}
