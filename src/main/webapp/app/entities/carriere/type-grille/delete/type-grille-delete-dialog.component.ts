import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeGrille } from '../type-grille.model';
import { TypeGrilleService } from '../service/type-grille.service';

@Component({
  templateUrl: './type-grille-delete-dialog.component.html',
})
export class TypeGrilleDeleteDialogComponent {
  typeGrille?: ITypeGrille;

  constructor(protected typeGrilleService: TypeGrilleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeGrilleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
