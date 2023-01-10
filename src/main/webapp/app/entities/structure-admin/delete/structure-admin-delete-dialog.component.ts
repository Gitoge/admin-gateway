import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStructureAdmin } from '../structure-admin.model';
import { StructureAdminService } from '../service/structure-admin.service';

@Component({
  templateUrl: './structure-admin-delete-dialog.component.html',
})
export class StructureAdminDeleteDialogComponent {
  structureAdmin?: IStructureAdmin;

  constructor(protected structureAdminService: StructureAdminService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.structureAdminService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
