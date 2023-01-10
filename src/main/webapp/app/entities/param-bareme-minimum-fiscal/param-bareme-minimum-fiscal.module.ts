import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParamBaremeMinimumFiscalComponent } from './list/param-bareme-minimum-fiscal.component';
import { ParamBaremeMinimumFiscalDetailComponent } from './detail/param-bareme-minimum-fiscal-detail.component';
import { ParamBaremeMinimumFiscalUpdateComponent } from './update/param-bareme-minimum-fiscal-update.component';
import { ParamBaremeMinimumFiscalDeleteDialogComponent } from './delete/param-bareme-minimum-fiscal-delete-dialog.component';
import { ParamBaremeMinimumFiscalRoutingModule } from './route/param-bareme-minimum-fiscal-routing.module';

@NgModule({
  imports: [SharedModule, ParamBaremeMinimumFiscalRoutingModule],
  declarations: [
    ParamBaremeMinimumFiscalComponent,
    ParamBaremeMinimumFiscalDetailComponent,
    ParamBaremeMinimumFiscalUpdateComponent,
    ParamBaremeMinimumFiscalDeleteDialogComponent,
  ],
  entryComponents: [ParamBaremeMinimumFiscalDeleteDialogComponent],
})
export class ParamBaremeMinimumFiscalModule {}
