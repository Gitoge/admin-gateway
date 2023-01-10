import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INatureActes } from '../nature-actes.model';
import { NatureActesService } from '../service/nature-actes.service';

@Component({
  templateUrl: './nature-actes-delete-dialog.component.html',
})
export class NatureActesDeleteDialogComponent {
  natureActes?: INatureActes;

  constructor(protected natureActesService: NatureActesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.natureActesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
