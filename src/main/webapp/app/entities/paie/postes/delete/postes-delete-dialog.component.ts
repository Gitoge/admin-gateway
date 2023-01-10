import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPostes } from '../postes.model';
import { PostesService } from '../service/postes.service';

@Component({
  templateUrl: './postes-delete-dialog.component.html',
})
export class PostesDeleteDialogComponent {
  postes?: IPostes;

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
