import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActionsComponent } from './list/actions.component';
import { ActionsDetailComponent } from './detail/actions-detail.component';
import { ActionsUpdateComponent } from './update/actions-update.component';
import { ActionsDeleteDialogComponent } from './delete/actions-delete-dialog.component';
import { ActionsRoutingModule } from './route/actions-routing.module';

@NgModule({
  imports: [SharedModule, ActionsRoutingModule],
  declarations: [ActionsComponent, ActionsDetailComponent, ActionsUpdateComponent, ActionsDeleteDialogComponent],
  entryComponents: [ActionsDeleteDialogComponent],
})
export class ActionsModule {}
