import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmoluments } from '../emoluments.model';
import { EmolumentsService } from '../service/emoluments.service';

@Component({
  templateUrl: './emoluments-delete-dialog.component.html',
})
export class EmolumentsDeleteDialogComponent {
  emoluments?: IEmoluments;

  constructor(protected emolumentsService: EmolumentsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emolumentsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
