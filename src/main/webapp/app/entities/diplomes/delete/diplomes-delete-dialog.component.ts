import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiplomes } from '../diplomes.model';
import { DiplomesService } from '../service/diplomes.service';

@Component({
  templateUrl: './diplomes-delete-dialog.component.html',
})
export class DiplomesDeleteDialogComponent {
  diplomes?: IDiplomes;

  constructor(protected diplomesService: DiplomesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.diplomesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
