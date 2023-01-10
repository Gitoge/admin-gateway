import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrilleIndiciaire } from '../grille-indiciaire.model';
import { GrilleIndiciaireService } from '../service/grille-indiciaire.service';

@Component({
  templateUrl: './grille-indiciaire-delete-dialog.component.html',
})
export class GrilleIndiciaireDeleteDialogComponent {
  grilleIndiciaire?: IGrilleIndiciaire;

  constructor(protected grilleIndiciaireService: GrilleIndiciaireService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grilleIndiciaireService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
