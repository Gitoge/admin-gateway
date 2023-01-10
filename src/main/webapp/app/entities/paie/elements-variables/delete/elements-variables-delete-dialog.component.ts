import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IElementsVariables } from '../elements-variables.model';
import { ElementsVariablesService } from '../service/elements-variables.service';

@Component({
  templateUrl: './elements-variables-delete-dialog.component.html',
})
export class ElementsVariablesDeleteDialogComponent {
  elementsVariables?: IElementsVariables;

  constructor(protected elementsVariablesService: ElementsVariablesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.elementsVariablesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
