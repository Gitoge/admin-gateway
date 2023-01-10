import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAugmentationIndice } from '../augmentation-indice.model';
import { AugmentationIndiceService } from '../service/augmentation-indice.service';

@Component({
  templateUrl: './augmentation-indice-delete-dialog.component.html',
})
export class AugmentationIndiceDeleteDialogComponent {
  augmentationIndice?: IAugmentationIndice;

  constructor(protected augmentationIndiceService: AugmentationIndiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.augmentationIndiceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
