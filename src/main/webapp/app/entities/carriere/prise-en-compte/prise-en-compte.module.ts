import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PriseEnCompteComponent } from './list/prise-en-compte.component';
import { PriseEnCompteDetailComponent } from './detail/prise-en-compte-detail.component';
import { PriseEnCompteUpdateComponent } from './update/prise-en-compte-update.component';
import { PriseEnCompteDeleteDialogComponent } from './delete/prise-en-compte-delete-dialog.component';
import { PriseEnCompteRoutingModule } from './route/prise-en-compte-routing.module';
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormEnfantComponent } from './form-enfant/form-enfant.component';
import { PieceAdministrativeComponent } from './piece-administrative';
import { PriseEnCompteSlideUpdateComponent } from './update-slide/prise-en-compte-slide-update.component';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DatePipe } from '@angular/common';
import { ListPriseEnCompteComponent } from './modification/list-prise-en-compte.component';
import { PriseEnCompteModifComponent } from './prise-en-compte-update/prise-en-compte-modifi.component';

@NgModule({
  imports: [SharedModule, PriseEnCompteRoutingModule, CommonModule, AutocompleteLibModule, Ng2SearchPipeModule],
  providers: [DatePipe],
  declarations: [
    PriseEnCompteComponent,
    PriseEnCompteDetailComponent,
    PriseEnCompteUpdateComponent,
    PriseEnCompteSlideUpdateComponent,
    PriseEnCompteDeleteDialogComponent,
    FormEnfantComponent,
    PieceAdministrativeComponent,
    ListPriseEnCompteComponent,
    PriseEnCompteModifComponent,
  ],
  entryComponents: [PriseEnCompteDeleteDialogComponent],
})
export class CarrierePriseEnCompteModule {}
