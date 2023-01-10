import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SaisieEmolumentsComponent } from './list/saisie-emoluments.component';
import { SaisieEmolumentsDetailComponent } from './detail/saisie-emoluments-detail.component';
import { SaisieEmolumentsUpdateComponent } from './update/saisie-emoluments-update.component';
import { SaisieEmolumentsDeleteDialogComponent } from './delete/saisie-emoluments-delete-dialog.component';
import { SaisieEmolumentsRoutingModule } from './route/saisie-emoluments-routing.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  imports: [SharedModule, SaisieEmolumentsRoutingModule, AutocompleteLibModule],
  declarations: [
    SaisieEmolumentsComponent,
    SaisieEmolumentsDetailComponent,
    SaisieEmolumentsUpdateComponent,
    SaisieEmolumentsDeleteDialogComponent,
  ],
  entryComponents: [SaisieEmolumentsDeleteDialogComponent],
})
export class PaieSaisieEmolumentsModule {}
