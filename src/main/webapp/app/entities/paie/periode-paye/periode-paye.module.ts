import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PeriodePayeComponent } from './list/periode-paye.component';
import { PeriodePayeDetailComponent } from './detail/periode-paye-detail.component';
import { PeriodePayeUpdateComponent } from './update/periode-paye-update.component';
import { PeriodePayeDeleteDialogComponent } from './delete/periode-paye-delete-dialog.component';
import { PeriodePayeRoutingModule } from './route/periode-paye-routing.module';

@NgModule({
  imports: [SharedModule, PeriodePayeRoutingModule],
  declarations: [PeriodePayeComponent, PeriodePayeDetailComponent, PeriodePayeUpdateComponent, PeriodePayeDeleteDialogComponent],
  entryComponents: [PeriodePayeDeleteDialogComponent],
})
export class PaiePeriodePayeModule {}
