import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrilleConventionComponent } from './list/grille-convention.component';
import { GrilleConventionDetailComponent } from './detail/grille-convention-detail.component';
import { GrilleConventionUpdateComponent } from './update/grille-convention-update.component';
import { GrilleConventionDeleteDialogComponent } from './delete/grille-convention-delete-dialog.component';
import { GrilleConventionRoutingModule } from './route/grille-convention-routing.module';

@NgModule({
  imports: [SharedModule, GrilleConventionRoutingModule],
  declarations: [
    GrilleConventionComponent,
    GrilleConventionDetailComponent,
    GrilleConventionUpdateComponent,
    GrilleConventionDeleteDialogComponent,
  ],
  entryComponents: [GrilleConventionDeleteDialogComponent],
})
export class CarriereGrilleConventionModule {}
