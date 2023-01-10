import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPages } from '../pages.model';
import { PagesService } from '../service/pages.service';

@Component({
  templateUrl: './pages-delete-dialog.component.html',
})
export class PagesDeleteDialogComponent {
  pages?: IPages;

  constructor(protected pagesService: PagesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pagesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
