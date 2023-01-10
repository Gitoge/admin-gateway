import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParamQuotiteCessibleComponent } from './list/param-quotite-cessible.component';
import { ParamQuotiteCessibleDetailComponent } from './detail/param-quotite-cessible-detail.component';
import { ParamQuotiteCessibleUpdateComponent } from './update/param-quotite-cessible-update.component';
import { ParamQuotiteCessibleDeleteDialogComponent } from './delete/param-quotite-cessible-delete-dialog.component';
import { ParamQuotiteCessibleRoutingModule } from './route/param-quotite-cessible-routing.module';

@NgModule({
  imports: [SharedModule, ParamQuotiteCessibleRoutingModule],
  declarations: [
    ParamQuotiteCessibleComponent,
    ParamQuotiteCessibleDetailComponent,
    ParamQuotiteCessibleUpdateComponent,
    ParamQuotiteCessibleDeleteDialogComponent,
  ],
  entryComponents: [ParamQuotiteCessibleDeleteDialogComponent],
})
export class ParamQuotiteCessibleModule {}
