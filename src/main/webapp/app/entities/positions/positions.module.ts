import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PositionsComponent } from './list/positions.component';
import { PositionsDetailComponent } from './detail/positions-detail.component';
import { PositionsUpdateComponent } from './update/positions-update.component';
import { PositionsDeleteDialogComponent } from './delete/positions-delete-dialog.component';
import { PositionsRoutingModule } from './route/positions-routing.module';

@NgModule({
  imports: [SharedModule, PositionsRoutingModule],
  declarations: [PositionsComponent, PositionsDetailComponent, PositionsUpdateComponent, PositionsDeleteDialogComponent],
  entryComponents: [PositionsDeleteDialogComponent],
})
export class PositionsModule {}
