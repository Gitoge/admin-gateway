import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NationaliteComponent } from './list/nationalite.component';
import { NationaliteDetailComponent } from './detail/nationalite-detail.component';
import { NationaliteUpdateComponent } from './update/nationalite-update.component';
import { NationaliteDeleteDialogComponent } from './delete/nationalite-delete-dialog.component';
import { NationaliteRoutingModule } from './route/nationalite-routing.module';

@NgModule({
  imports: [SharedModule, NationaliteRoutingModule],
  declarations: [NationaliteComponent, NationaliteDetailComponent, NationaliteUpdateComponent, NationaliteDeleteDialogComponent],
  entryComponents: [NationaliteDeleteDialogComponent],
})
export class CarriereNationaliteModule {}
