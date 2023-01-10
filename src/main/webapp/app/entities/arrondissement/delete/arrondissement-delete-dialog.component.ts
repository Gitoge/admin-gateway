import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArrondissement } from '../arrondissement.model';
import { ArrondissementService } from '../service/arrondissement.service';

@Component({
  templateUrl: './arrondissement-delete-dialog.component.html',
})
export class ArrondissementDeleteDialogComponent {
  arrondissement?: IArrondissement;

  constructor(protected arrondissementService: ArrondissementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.arrondissementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
