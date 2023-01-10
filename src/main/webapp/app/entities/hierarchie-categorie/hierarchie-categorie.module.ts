import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HierarchieCategorieComponent } from './list/hierarchie-categorie.component';
import { HierarchieCategorieDetailComponent } from './detail/hierarchie-categorie-detail.component';
import { HierarchieCategorieUpdateComponent } from './update/hierarchie-categorie-update.component';
import { HierarchieCategorieDeleteDialogComponent } from './delete/hierarchie-categorie-delete-dialog.component';
import { HierarchieCategorieRoutingModule } from './route/hierarchie-categorie-routing.module';

@NgModule({
  imports: [SharedModule, HierarchieCategorieRoutingModule],
  declarations: [
    HierarchieCategorieComponent,
    HierarchieCategorieDetailComponent,
    HierarchieCategorieUpdateComponent,
    HierarchieCategorieDeleteDialogComponent,
  ],
  entryComponents: [HierarchieCategorieDeleteDialogComponent],
})
export class HierarchieCategorieModule {}
