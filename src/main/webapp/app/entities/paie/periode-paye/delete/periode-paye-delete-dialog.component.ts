import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPeriodePaye } from '../periode-paye.model';
import { PeriodePayeService } from '../service/periode-paye.service';

@Component({
  templateUrl: './periode-paye-delete-dialog.component.html',
})
export class PeriodePayeDeleteDialogComponent {
  periodePaye?: IPeriodePaye;

  constructor(protected periodePayeService: PeriodePayeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.periodePayeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
