import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocumentAdministratif } from '../document-administratif.model';
import { DocumentAdministratifService } from '../service/document-administratif.service';

@Component({
  templateUrl: './document-administratif-delete-dialog.component.html',
})
export class DocumentAdministratifDeleteDialogComponent {
  documentAdministratif?: IDocumentAdministratif;

  constructor(protected documentAdministratifService: DocumentAdministratifService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.documentAdministratifService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
