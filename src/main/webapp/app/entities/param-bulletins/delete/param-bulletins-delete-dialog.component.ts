import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParamBulletins } from '../param-bulletins.model';
import { ParamBulletinsService } from '../service/param-bulletins.service';

@Component({
  templateUrl: './param-bulletins-delete-dialog.component.html',
})
export class ParamBulletinsDeleteDialogComponent {
  paramBulletins?: IParamBulletins;

  constructor(protected paramBulletinsService: ParamBulletinsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paramBulletinsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
