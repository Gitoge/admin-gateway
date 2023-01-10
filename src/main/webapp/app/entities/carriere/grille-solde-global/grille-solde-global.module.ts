import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrilleSoldeGlobalComponent } from './list/grille-solde-global.component';
import { GrilleSoldeGlobalRoutingModule } from './route/grille-solde-global-routing.module';
import { GrilleSoldeGlobalDetailComponent } from './detail/grille-solde-global-detail.component';
import { GrilleSoldeGlobalDeleteDialogComponent } from './delete/grille-solde-global-delete-dialog.component';
import { GrilleSoldeGlobalUpdateComponent } from './update/grille-solde-global-update.component';

@NgModule({
  imports: [SharedModule, GrilleSoldeGlobalRoutingModule],
  declarations: [
    GrilleSoldeGlobalComponent,
    GrilleSoldeGlobalDetailComponent,
    GrilleSoldeGlobalUpdateComponent,
    GrilleSoldeGlobalDeleteDialogComponent,
  ],
})
export class CarriereGrilleSoldeGlobalModule {}
