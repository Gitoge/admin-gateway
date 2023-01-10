import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParamBaremeImposableComponent } from './list/param-bareme-imposable.component';
import { ParamBaremeImposableDetailComponent } from './detail/param-bareme-imposable-detail.component';
import { ParamBaremeImposableUpdateComponent } from './update/param-bareme-imposable-update.component';
import { ParamBaremeImposableDeleteDialogComponent } from './delete/param-bareme-imposable-delete-dialog.component';
import { ParamBaremeImposableRoutingModule } from './route/param-bareme-imposable-routing.module';

@NgModule({
  imports: [SharedModule, ParamBaremeImposableRoutingModule],
  declarations: [
    ParamBaremeImposableComponent,
    ParamBaremeImposableDetailComponent,
    ParamBaremeImposableUpdateComponent,
    ParamBaremeImposableDeleteDialogComponent,
  ],
  entryComponents: [ParamBaremeImposableDeleteDialogComponent],
})
export class ParamBaremeImposableModule {}
