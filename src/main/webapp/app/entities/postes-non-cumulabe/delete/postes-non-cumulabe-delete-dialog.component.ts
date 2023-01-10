import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPostesNonCumulabe } from '../postes-non-cumulabe.model';
import { PostesNonCumulabeService } from '../service/postes-non-cumulabe.service';

@Component({
  templateUrl: './postes-non-cumulabe-delete-dialog.component.html',
})
export class PostesNonCumulabeDeleteDialogComponent {
  postesNonCumulabe?: IPostesNonCumulabe;

  constructor(protected postesNonCumulabeService: PostesNonCumulabeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.postesNonCumulabeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
