import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHierarchieCategorie } from '../hierarchie-categorie.model';
import { HierarchieCategorieService } from '../service/hierarchie-categorie.service';

@Component({
  templateUrl: './hierarchie-categorie-delete-dialog.component.html',
})
export class HierarchieCategorieDeleteDialogComponent {
  hierarchieCategorie?: IHierarchieCategorie;

  constructor(protected hierarchieCategorieService: HierarchieCategorieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.hierarchieCategorieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
