import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParamBaremeImposable } from '../param-bareme-imposable.model';
import { ParamBaremeImposableService } from '../service/param-bareme-imposable.service';

@Component({
  templateUrl: './param-bareme-imposable-delete-dialog.component.html',
})
export class ParamBaremeImposableDeleteDialogComponent {
  paramBaremeImposable?: IParamBaremeImposable;

  constructor(protected paramBaremeImposableService: ParamBaremeImposableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paramBaremeImposableService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
