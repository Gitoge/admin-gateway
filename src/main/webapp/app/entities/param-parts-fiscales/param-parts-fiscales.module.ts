import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParamPartsFiscalesComponent } from './list/param-parts-fiscales.component';
import { ParamPartsFiscalesDetailComponent } from './detail/param-parts-fiscales-detail.component';
import { ParamPartsFiscalesUpdateComponent } from './update/param-parts-fiscales-update.component';
import { ParamPartsFiscalesDeleteDialogComponent } from './delete/param-parts-fiscales-delete-dialog.component';
import { ParamPartsFiscalesRoutingModule } from './route/param-parts-fiscales-routing.module';

@NgModule({
  imports: [SharedModule, ParamPartsFiscalesRoutingModule],
  declarations: [
    ParamPartsFiscalesComponent,
    ParamPartsFiscalesDetailComponent,
    ParamPartsFiscalesUpdateComponent,
    ParamPartsFiscalesDeleteDialogComponent,
  ],
  entryComponents: [ParamPartsFiscalesDeleteDialogComponent],
})
export class ParamPartsFiscalesModule {}
