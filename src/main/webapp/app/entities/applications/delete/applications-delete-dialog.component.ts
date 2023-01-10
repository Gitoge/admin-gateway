import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplications } from '../applications.model';
import { ApplicationsService } from '../service/applications.service';

@Component({
  templateUrl: './applications-delete-dialog.component.html',
})
export class ApplicationsDeleteDialogComponent {
  applications?: IApplications;

  constructor(protected applicationsService: ApplicationsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicationsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
