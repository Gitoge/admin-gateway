import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';
import { ParamBaremeMinimumFiscalService } from '../service/param-bareme-minimum-fiscal.service';

@Component({
  templateUrl: './param-bareme-minimum-fiscal-delete-dialog.component.html',
})
export class ParamBaremeMinimumFiscalDeleteDialogComponent {
  paramBaremeMinimumFiscal?: IParamBaremeMinimumFiscal;

  constructor(protected paramBaremeMinimumFiscalService: ParamBaremeMinimumFiscalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paramBaremeMinimumFiscalService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
