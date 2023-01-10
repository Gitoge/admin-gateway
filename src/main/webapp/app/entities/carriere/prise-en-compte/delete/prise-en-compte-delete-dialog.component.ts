import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPriseEnCompte } from '../prise-en-compte.model';
import { PriseEnCompteService } from '../service/prise-en-compte.service';

@Component({
  templateUrl: './prise-en-compte-delete-dialog.component.html',
})
export class PriseEnCompteDeleteDialogComponent {
  priseencompte?: IPriseEnCompte;

  constructor(protected priseencompteService: PriseEnCompteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.priseencompteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
