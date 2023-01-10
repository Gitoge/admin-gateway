import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategorieActes } from '../categorie-actes.model';
import { CategorieActesService } from '../service/categorie-actes.service';

@Component({
  templateUrl: './categorie-actes-delete-dialog.component.html',
})
export class CategorieActesDeleteDialogComponent {
  categorieActes?: ICategorieActes;

  constructor(protected categorieActesService: CategorieActesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categorieActesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
