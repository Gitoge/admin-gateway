import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';
import { BaremeCalculHeuresSuppService } from '../service/bareme-calcul-heures-supp.service';

@Component({
  templateUrl: './bareme-calcul-heures-supp-delete-dialog.component.html',
})
export class BaremeCalculHeuresSuppDeleteDialogComponent {
  baremeCalculHeuresSupp?: IBaremeCalculHeuresSupp;

  constructor(protected baremeCalculHeuresSuppService: BaremeCalculHeuresSuppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.baremeCalculHeuresSuppService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
