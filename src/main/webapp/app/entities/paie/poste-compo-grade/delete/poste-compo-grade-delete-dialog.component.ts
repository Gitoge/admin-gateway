import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPosteCompoGrade } from '../poste-compo-grade.model';
import { PosteCompoGradeService } from '../service/poste-compo-grade.service';

@Component({
  templateUrl: './poste-compo-grade-delete-dialog.component.html',
})
export class PosteCompoGradeDeleteDialogComponent {
  posteCompoGrade?: IPosteCompoGrade;

  constructor(protected posteCompoGradeService: PosteCompoGradeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.posteCompoGradeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
