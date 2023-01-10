import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEnfant } from '../enfant.model';
import { EnfantService } from '../service/enfant.service';

@Component({
  templateUrl: './enfant-delete-dialog.component.html',
})
export class EnfantDeleteDialogComponent {
  enfant?: IEnfant;

  constructor(protected enfantService: EnfantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.enfantService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
