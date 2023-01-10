import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFichePaie } from '../fiche-paie.model';
import { FichePaieService } from '../service/fiche-paie.service';

@Component({
  templateUrl: './fiche-paie-delete-dialog.component.html',
})
export class FichePaieDeleteDialogComponent {
  fichePaie?: IFichePaie;

  constructor(protected fichePaieService: FichePaieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fichePaieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
