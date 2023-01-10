import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeGrilleComponent } from './list/type-grille.component';
import { TypeGrilleDetailComponent } from './detail/type-grille-detail.component';
import { TypeGrilleUpdateComponent } from './update/type-grille-update.component';
import { TypeGrilleDeleteDialogComponent } from './delete/type-grille-delete-dialog.component';
import { TypeGrilleRoutingModule } from './route/type-grille-routing.module';

@NgModule({
  imports: [SharedModule, TypeGrilleRoutingModule],
  declarations: [TypeGrilleComponent, TypeGrilleDetailComponent, TypeGrilleUpdateComponent, TypeGrilleDeleteDialogComponent],
  entryComponents: [TypeGrilleDeleteDialogComponent],
})
export class CarriereTypeGrilleModule {}
