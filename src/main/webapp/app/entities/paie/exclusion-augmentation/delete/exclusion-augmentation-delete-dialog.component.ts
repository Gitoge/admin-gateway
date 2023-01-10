import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExclusionAugmentation } from '../exclusion-augmentation.model';
import { ExclusionAugmentationService } from '../service/exclusion-augmentation.service';

@Component({
  templateUrl: './exclusion-augmentation-delete-dialog.component.html',
})
export class ExclusionAugmentationDeleteDialogComponent {
  exclusionAugmentation?: IExclusionAugmentation;

  constructor(protected exclusionAugmentationService: ExclusionAugmentationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exclusionAugmentationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
