import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParamPartsFiscales } from '../param-parts-fiscales.model';
import { ParamPartsFiscalesService } from '../service/param-parts-fiscales.service';

@Component({
  templateUrl: './param-parts-fiscales-delete-dialog.component.html',
})
export class ParamPartsFiscalesDeleteDialogComponent {
  paramPartsFiscales?: IParamPartsFiscales;

  constructor(protected paramPartsFiscalesService: ParamPartsFiscalesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paramPartsFiscalesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
