import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPosteGrade } from '../poste-grade.model';
import { PosteGradeService } from '../service/poste-grade.service';

@Component({
  templateUrl: './poste-grade-delete-dialog.component.html',
})
export class PosteGradeDeleteDialogComponent {
  posteGrade?: IPosteGrade;

  constructor(protected posteGradeService: PosteGradeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.posteGradeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
