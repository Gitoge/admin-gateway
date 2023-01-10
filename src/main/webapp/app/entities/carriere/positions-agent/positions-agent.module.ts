import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PositionsAgentComponent } from './list/positions-agent.component';
import { PositionsAgentDetailComponent } from './detail/positions-agent-detail.component';
import { PositionsAgentUpdateComponent } from './update/positions-agent-update.component';
import { PositionsAgentDeleteDialogComponent } from './delete/positions-agent-delete-dialog.component';
import { PositionsAgentRoutingModule } from './route/positions-agent-routing.module';

@NgModule({
  imports: [SharedModule, PositionsAgentRoutingModule],
  declarations: [
    PositionsAgentComponent,
    PositionsAgentDetailComponent,
    PositionsAgentUpdateComponent,
    PositionsAgentDeleteDialogComponent,
  ],
  entryComponents: [PositionsAgentDeleteDialogComponent],
})
export class CarrierePositionsAgentModule {}
