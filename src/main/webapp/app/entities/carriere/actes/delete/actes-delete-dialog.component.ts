import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActes } from '../actes.model';
import { ActesService } from '../service/actes.service';

@Component({
  templateUrl: './actes-delete-dialog.component.html',
})
export class ActesDeleteDialogComponent {
  actes?: IActes;

  constructor(protected actesService: ActesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
