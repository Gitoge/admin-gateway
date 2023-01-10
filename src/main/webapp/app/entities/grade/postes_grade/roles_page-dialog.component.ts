import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PostesService } from '../../postes/service/postes.service';

@Component({
  templateUrl: './roles_page-dialog.component.html',
})
export class PostesGradeDialogComponent {
  postes: any;
  grade: any;
  constructor(protected postesService: PostesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.postesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
