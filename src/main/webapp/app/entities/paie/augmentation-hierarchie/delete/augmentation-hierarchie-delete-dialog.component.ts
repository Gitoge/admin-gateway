import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAugmentationHierarchie } from '../augmentation-hierarchie.model';
import { AugmentationHierarchieService } from '../service/augmentation-hierarchie.service';

@Component({
  templateUrl: './augmentation-hierarchie-delete-dialog.component.html',
})
export class AugmentationHierarchieDeleteDialogComponent {
  augmentationHierarchie?: IAugmentationHierarchie;

  constructor(protected augmentationHierarchieService: AugmentationHierarchieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.augmentationHierarchieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
