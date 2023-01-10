import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BaremeCalculHeuresSuppComponent } from './list/bareme-calcul-heures-supp.component';
import { BaremeCalculHeuresSuppDetailComponent } from './detail/bareme-calcul-heures-supp-detail.component';
import { BaremeCalculHeuresSuppUpdateComponent } from './update/bareme-calcul-heures-supp-update.component';
import { BaremeCalculHeuresSuppDeleteDialogComponent } from './delete/bareme-calcul-heures-supp-delete-dialog.component';
import { BaremeCalculHeuresSuppRoutingModule } from './route/bareme-calcul-heures-supp-routing.module';

@NgModule({
  imports: [SharedModule, BaremeCalculHeuresSuppRoutingModule],
  declarations: [
    BaremeCalculHeuresSuppComponent,
    BaremeCalculHeuresSuppDetailComponent,
    BaremeCalculHeuresSuppUpdateComponent,
    BaremeCalculHeuresSuppDeleteDialogComponent,
  ],
  entryComponents: [BaremeCalculHeuresSuppDeleteDialogComponent],
})
export class PaieBaremeCalculHeuresSuppModule {}
