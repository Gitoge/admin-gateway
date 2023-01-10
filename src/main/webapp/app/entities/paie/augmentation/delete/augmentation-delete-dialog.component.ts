import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAugmentation } from '../augmentation.model';
import { AugmentationService } from '../service/augmentation.service';

@Component({
  templateUrl: './augmentation-delete-dialog.component.html',
})
export class AugmentationDeleteDialogComponent {
  augmentation?: IAugmentation;

  constructor(protected augmentationService: AugmentationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.augmentationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
