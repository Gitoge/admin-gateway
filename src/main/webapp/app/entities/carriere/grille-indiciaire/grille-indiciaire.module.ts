import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrilleIndiciaireComponent } from './list/grille-indiciaire.component';
import { GrilleIndiciaireDetailComponent } from './detail/grille-indiciaire-detail.component';
import { GrilleIndiciaireUpdateComponent } from './update/grille-indiciaire-update.component';
import { GrilleIndiciaireDeleteDialogComponent } from './delete/grille-indiciaire-delete-dialog.component';
import { GrilleIndiciaireRoutingModule } from './route/grille-indiciaire-routing.module';

@NgModule({
  imports: [SharedModule, GrilleIndiciaireRoutingModule],
  declarations: [
    GrilleIndiciaireComponent,
    GrilleIndiciaireDetailComponent,
    GrilleIndiciaireUpdateComponent,
    GrilleIndiciaireDeleteDialogComponent,
  ],
  entryComponents: [GrilleIndiciaireDeleteDialogComponent],
})
export class CarriereGrilleIndiciaireModule {}
