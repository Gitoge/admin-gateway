import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmolumentsComponent } from './list/emoluments.component';
import { EmolumentsDetailComponent } from './detail/emoluments-detail.component';
import { EmolumentsUpdateComponent } from './update/emoluments-update.component';
import { EmolumentsDeleteDialogComponent } from './delete/emoluments-delete-dialog.component';
import { EmolumentsRoutingModule } from './route/emoluments-routing.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [SharedModule, EmolumentsRoutingModule, AutocompleteLibModule, Ng2SearchPipeModule],
  declarations: [EmolumentsComponent, EmolumentsDetailComponent, EmolumentsUpdateComponent, EmolumentsDeleteDialogComponent],
  entryComponents: [EmolumentsDeleteDialogComponent],
})
export class PaieEmolumentsModule {}
