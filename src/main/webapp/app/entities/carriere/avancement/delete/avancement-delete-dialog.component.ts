import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAvancement } from '../avancement.model';
import { AvancementService } from '../service/avancement.service';

@Component({
  templateUrl: './avancement-delete-dialog.component.html',
})
export class AvancementDeleteDialogComponent {
  avancement?: IAvancement;

  constructor(protected avancementService: AvancementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.avancementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
