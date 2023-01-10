import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEchelon } from '../echelon.model';
import { EchelonService } from '../service/echelon.service';

@Component({
  templateUrl: './echelon-delete-dialog.component.html',
})
export class EchelonDeleteDialogComponent {
  echelon?: IEchelon;

  constructor(protected echelonService: EchelonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.echelonService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
