import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIndices } from '../indices.model';
import { IndicesService } from '../service/indices.service';

@Component({
  templateUrl: './indices-delete-dialog.component.html',
})
export class IndicesDeleteDialogComponent {
  indices?: IIndices;

  constructor(protected indicesService: IndicesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.indicesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
