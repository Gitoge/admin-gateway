import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeActes } from '../type-actes.model';
import { TypeActesService } from '../service/type-actes.service';

@Component({
  templateUrl: './type-actes-delete-dialog.component.html',
})
export class TypeActesDeleteDialogComponent {
  typeActes?: ITypeActes;

  constructor(protected typeActesService: TypeActesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeActesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
