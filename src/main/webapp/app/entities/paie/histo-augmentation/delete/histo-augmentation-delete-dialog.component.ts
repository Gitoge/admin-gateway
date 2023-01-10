import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoAugmentation } from '../histo-augmentation.model';
import { HistoAugmentationService } from '../service/histo-augmentation.service';

@Component({
  templateUrl: './histo-augmentation-delete-dialog.component.html',
})
export class HistoAugmentationDeleteDialogComponent {
  histoAugmentation?: IHistoAugmentation;

  constructor(protected histoAugmentationService: HistoAugmentationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.histoAugmentationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
