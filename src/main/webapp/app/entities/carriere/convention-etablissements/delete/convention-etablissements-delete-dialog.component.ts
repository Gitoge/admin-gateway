import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConventionEtablissements } from '../convention-etablissements.model';
import { ConventionEtablissementsService } from '../service/convention-etablissements.service';

@Component({
  templateUrl: './convention-etablissements-delete-dialog.component.html',
})
export class ConventionEtablissementsDeleteDialogComponent {
  conventionEtablissements?: IConventionEtablissements;

  constructor(protected conventionEtablissementsService: ConventionEtablissementsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conventionEtablissementsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
