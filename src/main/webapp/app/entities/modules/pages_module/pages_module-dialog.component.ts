import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPages } from 'app/entities/pages/pages.model';

import { IModules } from '../modules.model';
import { ModulesService } from '../service/modules.service';

@Component({
  templateUrl: './pages_module-dialog.component.html',
})
export class PagesModuleDialogComponent {
  modules?: IModules;

  pages?: IPages[];

  constructor(protected modulesService: ModulesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }
}
