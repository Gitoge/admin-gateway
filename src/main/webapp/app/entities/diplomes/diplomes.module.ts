import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiplomesComponent } from './list/diplomes.component';
import { DiplomesDetailComponent } from './detail/diplomes-detail.component';
import { DiplomesUpdateComponent } from './update/diplomes-update.component';
import { DiplomesDeleteDialogComponent } from './delete/diplomes-delete-dialog.component';
import { DiplomesRoutingModule } from './route/diplomes-routing.module';

@NgModule({
  imports: [SharedModule, DiplomesRoutingModule],
  declarations: [DiplomesComponent, DiplomesDetailComponent, DiplomesUpdateComponent, DiplomesDeleteDialogComponent],
  entryComponents: [DiplomesDeleteDialogComponent],
})
export class DiplomesModule {}
