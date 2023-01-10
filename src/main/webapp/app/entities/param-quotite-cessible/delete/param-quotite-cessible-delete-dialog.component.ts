import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParamQuotiteCessible } from '../param-quotite-cessible.model';
import { ParamQuotiteCessibleService } from '../service/param-quotite-cessible.service';

@Component({
  templateUrl: './param-quotite-cessible-delete-dialog.component.html',
})
export class ParamQuotiteCessibleDeleteDialogComponent {
  paramQuotiteCessible?: IParamQuotiteCessible;

  constructor(protected paramQuotiteCessibleService: ParamQuotiteCessibleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paramQuotiteCessibleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
