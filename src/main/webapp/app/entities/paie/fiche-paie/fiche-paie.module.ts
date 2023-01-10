import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FichePaieComponent } from './list/fiche-paie.component';
import { FichePaieDetailComponent } from './detail/fiche-paie-detail.component';
import { FichePaieUpdateComponent } from './update/fiche-paie-update.component';
import { FichePaieDeleteDialogComponent } from './delete/fiche-paie-delete-dialog.component';
import { FichePaieRoutingModule } from './route/fiche-paie-routing.module';
import { FichePaieVisualiserComponent } from './visualiser/fiche-paie.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { StatistiqueComponent } from './statistique/fiche-paie.component';

@NgModule({
  imports: [SharedModule, FichePaieRoutingModule, AutocompleteLibModule],
  declarations: [
    FichePaieComponent,
    FichePaieDetailComponent,
    FichePaieUpdateComponent,
    FichePaieDeleteDialogComponent,
    FichePaieVisualiserComponent,
    StatistiqueComponent,
  ],
  entryComponents: [FichePaieDeleteDialogComponent],
})
export class PaieFichePaieModule {}
