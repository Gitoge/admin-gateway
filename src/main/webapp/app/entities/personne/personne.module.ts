import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PersonneComponent } from './list/personne.component';
import { PersonneDetailComponent } from './detail/personne-detail.component';
import { PersonneUpdateComponent } from './update/personne-update.component';
import { PersonneDeleteDialogComponent } from './delete/personne-delete-dialog.component';
import { PersonneRoutingModule } from './route/personne-routing.module';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  imports: [SharedModule, PersonneRoutingModule, TranslateModule, TranslateModule, CommonModule, CommonModule, AutocompleteLibModule],
  declarations: [
    PersonneComponent,
    PersonneDetailComponent,
    PersonneUpdateComponent,
    PersonneDeleteDialogComponent,
    PasswordStrengthBarComponent,
  ],
  entryComponents: [PersonneDeleteDialogComponent],
})
export class PersonneModule {}
