import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParamBulletinsComponent } from './list/param-bulletins.component';
import { ParamBulletinsDetailComponent } from './detail/param-bulletins-detail.component';
import { ParamBulletinsUpdateComponent } from './update/param-bulletins-update.component';
import { ParamBulletinsDeleteDialogComponent } from './delete/param-bulletins-delete-dialog.component';
import { ParamBulletinsRoutingModule } from './route/param-bulletins-routing.module';

@NgModule({
  imports: [SharedModule, ParamBulletinsRoutingModule],
  declarations: [
    ParamBulletinsComponent,
    ParamBulletinsDetailComponent,
    ParamBulletinsUpdateComponent,
    ParamBulletinsDeleteDialogComponent,
  ],
  entryComponents: [ParamBulletinsDeleteDialogComponent],
})
export class ParamBulletinsModule {}
