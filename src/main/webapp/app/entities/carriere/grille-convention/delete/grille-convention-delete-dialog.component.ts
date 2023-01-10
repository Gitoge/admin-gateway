import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrilleConvention } from '../grille-convention.model';
import { GrilleConventionService } from '../service/grille-convention.service';

@Component({
  templateUrl: './grille-convention-delete-dialog.component.html',
})
export class GrilleConventionDeleteDialogComponent {
  grilleConvention?: IGrilleConvention;

  constructor(protected grilleConventionService: GrilleConventionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grilleConventionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
