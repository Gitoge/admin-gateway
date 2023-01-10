import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SaisieElementsVariablesComponent } from './list/saisie-elements-variables.component';
import { SaisieElementsVariablesDetailComponent } from './detail/saisie-elements-variables-detail.component';
import { SaisieElementsVariablesUpdateComponent } from './update/saisie-elements-variables-update.component';
import { SaisieElementsVariablesDeleteDialogComponent } from './delete/saisie-elements-variables-delete-dialog.component';
import { SaisieElementsVariablesRoutingModule } from './route/saisie-elements-variables-routing.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HeuresSuppComponent } from './heures_supp/heures_supp.component';
import { SaisieElementsVariablesUpdateSelComponent } from './updatesel/saisie-elements-variables-update.component';

@NgModule({
  imports: [SharedModule, SaisieElementsVariablesRoutingModule, AutocompleteLibModule],
  declarations: [
    SaisieElementsVariablesComponent,
    SaisieElementsVariablesDetailComponent,
    SaisieElementsVariablesUpdateComponent,
    SaisieElementsVariablesDeleteDialogComponent,
    SaisieElementsVariablesUpdateSelComponent,
    HeuresSuppComponent,
  ],
  entryComponents: [SaisieElementsVariablesDeleteDialogComponent],
})
export class PaieSaisieElementsVariablesModule {}
