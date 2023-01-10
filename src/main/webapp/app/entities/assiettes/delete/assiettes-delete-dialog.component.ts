import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAssiettes } from '../assiettes.model';
import { AssiettesService } from '../service/assiettes.service';

@Component({
  templateUrl: './assiettes-delete-dialog.component.html',
})
export class AssiettesDeleteDialogComponent {
  assiettes?: IAssiettes;

  constructor(protected assiettesService: AssiettesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assiettesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
