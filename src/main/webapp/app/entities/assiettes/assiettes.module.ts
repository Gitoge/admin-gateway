import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AssiettesComponent } from './list/assiettes.component';
import { AssiettesDetailComponent } from './detail/assiettes-detail.component';
import { AssiettesUpdateComponent } from './update/assiettes-update.component';
import { AssiettesDeleteDialogComponent } from './delete/assiettes-delete-dialog.component';
import { AssiettesRoutingModule } from './route/assiettes-routing.module';
import { AssiettesPostesDialogComponent } from './postes_assiettes/postes_assiettes.component-dialog';

@NgModule({
  imports: [SharedModule, AssiettesRoutingModule],
  declarations: [
    AssiettesComponent,
    AssiettesDetailComponent,
    AssiettesUpdateComponent,
    AssiettesDeleteDialogComponent,
    AssiettesPostesDialogComponent,
  ],
  entryComponents: [AssiettesDeleteDialogComponent],
})
export class AssiettesModule {}
