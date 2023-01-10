import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPostesReferenceActes } from '../postes-reference-actes.model';
import { PostesReferenceActesService } from '../service/postes-reference-actes.service';

@Component({
  templateUrl: './postes-reference-actes-delete-dialog.component.html',
})
export class PostesReferenceActesDeleteDialogComponent {
  postesReferenceActes?: IPostesReferenceActes;

  constructor(protected postesReferenceActesService: PostesReferenceActesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.postesReferenceActesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
