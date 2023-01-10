import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISituationAdministrative } from '../situation-administrative.model';
import { SituationAdministrativeService } from '../service/situation-administrative.service';

@Component({
  templateUrl: './situation-administrative-delete-dialog.component.html',
})
export class SituationAdministrativeDeleteDialogComponent {
  situationAdministrative?: ISituationAdministrative;

  constructor(protected situationAdministrativeService: SituationAdministrativeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.situationAdministrativeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
