import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPositionsAgent } from '../positions-agent.model';
import { PositionsAgentService } from '../service/positions-agent.service';

@Component({
  templateUrl: './positions-agent-delete-dialog.component.html',
})
export class PositionsAgentDeleteDialogComponent {
  positionsAgent?: IPositionsAgent;

  constructor(protected positionsAgentService: PositionsAgentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.positionsAgentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
