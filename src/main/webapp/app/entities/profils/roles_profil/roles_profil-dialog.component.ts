import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfils } from '../profils.model';
import { ProfilsService } from '../service/profils.service';

@Component({
  templateUrl: './roles_profil-dialog.component.html',
})
export class RolesProfilDialogComponent {
  profils?: IProfils;

  constructor(protected profilsService: ProfilsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.profilsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
