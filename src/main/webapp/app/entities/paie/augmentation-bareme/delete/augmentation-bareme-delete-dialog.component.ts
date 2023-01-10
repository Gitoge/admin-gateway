import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAugmentationBareme } from '../augmentation-bareme.model';
import { AugmentationBaremeService } from '../service/augmentation-bareme.service';

@Component({
  templateUrl: './augmentation-bareme-delete-dialog.component.html',
})
export class AugmentationBaremeDeleteDialogComponent {
  augmentationBareme?: IAugmentationBareme;

  constructor(protected augmentationBaremeService: AugmentationBaremeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.augmentationBaremeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
