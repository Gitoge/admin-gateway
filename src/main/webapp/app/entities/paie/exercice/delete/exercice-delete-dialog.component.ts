import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExercice } from '../exercice.model';
import { ExerciceService } from '../service/exercice.service';

@Component({
  templateUrl: './exercice-delete-dialog.component.html',
})
export class ExerciceDeleteDialogComponent {
  exercice?: IExercice;

  constructor(protected exerciceService: ExerciceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exerciceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
