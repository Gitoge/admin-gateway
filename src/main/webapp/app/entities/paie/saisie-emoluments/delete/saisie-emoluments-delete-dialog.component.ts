import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaisieEmoluments } from '../saisie-emoluments.model';
import { SaisieEmolumentsService } from '../service/saisie-emoluments.service';

@Component({
  templateUrl: './saisie-emoluments-delete-dialog.component.html',
})
export class SaisieEmolumentsDeleteDialogComponent {
  saisieEmoluments?: ISaisieEmoluments;

  constructor(protected saisieEmolumentsService: SaisieEmolumentsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.saisieEmolumentsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
