import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISituationFamiliale } from '../situation-familiale.model';
import { SituationFamilialeService } from '../service/situation-familiale.service';

@Component({
  templateUrl: './situation-familiale-delete-dialog.component.html',
})
export class SituationFamilialeDeleteDialogComponent {
  situationFamiliale?: ISituationFamiliale;

  constructor(protected situationFamilialeService: SituationFamilialeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.situationFamilialeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
