import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaisieElementsVariables } from '../saisie-elements-variables.model';
import { SaisieElementsVariablesService } from '../service/saisie-elements-variables.service';

@Component({
  templateUrl: './saisie-elements-variables-delete-dialog.component.html',
})
export class SaisieElementsVariablesDeleteDialogComponent {
  saisieElementsVariables?: ISaisieElementsVariables;

  constructor(protected saisieElementsVariablesService: SaisieElementsVariablesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.saisieElementsVariablesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
