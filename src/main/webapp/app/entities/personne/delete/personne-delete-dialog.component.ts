import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonne } from '../personne.model';
import { PersonneService } from '../service/personne.service';
import { StateStorageService } from '../../../core/auth/state-storage.service';

@Component({
  templateUrl: './personne-delete-dialog.component.html',
})
export class PersonneDeleteDialogComponent {
  personne?: IPersonne;
  test = this.stateStorageService.getPersonne().dateDerniereConnexion;

  constructor(
    protected personneService: PersonneService,
    protected activeModal: NgbActiveModal,
    protected stateStorageService: StateStorageService
  ) {}
  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personneService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
