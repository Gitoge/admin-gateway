import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EchelonComponent } from './list/echelon.component';
import { EchelonDetailComponent } from './detail/echelon-detail.component';
import { EchelonUpdateComponent } from './update/echelon-update.component';
import { EchelonDeleteDialogComponent } from './delete/echelon-delete-dialog.component';
import { EchelonRoutingModule } from './route/echelon-routing.module';

@NgModule({
  imports: [SharedModule, EchelonRoutingModule],
  declarations: [EchelonComponent, EchelonDetailComponent, EchelonUpdateComponent, EchelonDeleteDialogComponent],
  entryComponents: [EchelonDeleteDialogComponent],
})
export class EchelonModule {}
