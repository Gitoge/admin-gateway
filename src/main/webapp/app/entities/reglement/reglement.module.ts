import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReglementComponent } from './list/reglement.component';
import { ReglementDetailComponent } from './detail/reglement-detail.component';
import { ReglementUpdateComponent } from './update/reglement-update.component';
import { ReglementDeleteDialogComponent } from './delete/reglement-delete-dialog.component';
import { ReglementRoutingModule } from './route/reglement-routing.module';

@NgModule({
  imports: [SharedModule, ReglementRoutingModule],
  declarations: [ReglementComponent, ReglementDetailComponent, ReglementUpdateComponent, ReglementDeleteDialogComponent],
  entryComponents: [ReglementDeleteDialogComponent],
})
export class ReglementModule {}
