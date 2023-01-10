import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParamMatricules } from '../param-matricules.model';
import { ParamMatriculesService } from '../service/param-matricules.service';

@Component({
  templateUrl: './param-matricules-delete-dialog.component.html',
})
export class ParamMatriculesDeleteDialogComponent {
  paramMatricules?: IParamMatricules;

  constructor(protected paramMatriculesService: ParamMatriculesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paramMatriculesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
