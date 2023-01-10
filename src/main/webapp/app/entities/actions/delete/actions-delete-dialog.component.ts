import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActions } from '../actions.model';
import { ActionsService } from '../service/actions.service';

@Component({
  templateUrl: './actions-delete-dialog.component.html',
})
export class ActionsDeleteDialogComponent {
  actions?: IActions;

  constructor(protected actionsService: ActionsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actionsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
