import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoles } from '../roles.model';
import { RolesService } from '../service/roles.service';

@Component({
  templateUrl: './pages_actions_role.component.html',
})
export class PagesActionsRoleComponent {
  roles?: IRoles;

  constructor(protected rolesService: RolesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }
}
