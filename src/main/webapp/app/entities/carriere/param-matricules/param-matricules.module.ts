import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParamMatriculesComponent } from './list/param-matricules.component';
import { ParamMatriculesDetailComponent } from './detail/param-matricules-detail.component';
import { ParamMatriculesUpdateComponent } from './update/param-matricules-update.component';
import { ParamMatriculesDeleteDialogComponent } from './delete/param-matricules-delete-dialog.component';
import { ParamMatriculesRoutingModule } from './route/param-matricules-routing.module';

@NgModule({
  imports: [SharedModule, ParamMatriculesRoutingModule],
  declarations: [
    ParamMatriculesComponent,
    ParamMatriculesDetailComponent,
    ParamMatriculesUpdateComponent,
    ParamMatriculesDeleteDialogComponent,
  ],
  entryComponents: [ParamMatriculesDeleteDialogComponent],
})
export class CarriereParamMatriculesModule {}
