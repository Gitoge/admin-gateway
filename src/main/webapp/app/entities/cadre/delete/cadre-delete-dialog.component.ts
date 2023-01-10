import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICadre } from '../cadre.model';
import { CadreService } from '../service/cadre.service';

@Component({
  templateUrl: './cadre-delete-dialog.component.html',
})
export class CadreDeleteDialogComponent {
  cadre?: ICadre;

  constructor(protected cadreService: CadreService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cadreService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
