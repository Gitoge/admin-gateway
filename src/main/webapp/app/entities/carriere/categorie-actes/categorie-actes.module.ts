import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategorieActesComponent } from './list/categorie-actes.component';
import { CategorieActesDetailComponent } from './detail/categorie-actes-detail.component';
import { CategorieActesUpdateComponent } from './update/categorie-actes-update.component';
import { CategorieActesDeleteDialogComponent } from './delete/categorie-actes-delete-dialog.component';
import { CategorieActesRoutingModule } from './route/categorie-actes-routing.module';

@NgModule({
  imports: [SharedModule, CategorieActesRoutingModule],
  declarations: [
    CategorieActesComponent,
    CategorieActesDetailComponent,
    CategorieActesUpdateComponent,
    CategorieActesDeleteDialogComponent,
  ],
  entryComponents: [CategorieActesDeleteDialogComponent],
})
export class CarriereCategorieActesModule {}
