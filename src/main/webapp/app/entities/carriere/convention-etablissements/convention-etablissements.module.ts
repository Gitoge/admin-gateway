import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConventionEtablissementsComponent } from './list/convention-etablissements.component';
import { ConventionEtablissementsDetailComponent } from './detail/convention-etablissements-detail.component';
import { ConventionEtablissementsUpdateComponent } from './update/convention-etablissements-update.component';
import { ConventionEtablissementsDeleteDialogComponent } from './delete/convention-etablissements-delete-dialog.component';
import { ConventionEtablissementsRoutingModule } from './route/convention-etablissements-routing.module';

@NgModule({
  imports: [SharedModule, ConventionEtablissementsRoutingModule],
  declarations: [
    ConventionEtablissementsComponent,
    ConventionEtablissementsDetailComponent,
    ConventionEtablissementsUpdateComponent,
    ConventionEtablissementsDeleteDialogComponent,
  ],
  entryComponents: [ConventionEtablissementsDeleteDialogComponent],
})
export class CarriereConventionEtablissementsModule {}
