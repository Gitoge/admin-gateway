import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExclusionTaux } from '../exclusion-taux.model';
import { ExclusionTauxService } from '../service/exclusion-taux.service';

@Component({
  templateUrl: './exclusion-taux-delete-dialog.component.html',
})
export class ExclusionTauxDeleteDialogComponent {
  exclusionTaux?: IExclusionTaux;

  constructor(protected exclusionTauxService: ExclusionTauxService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exclusionTauxService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
