import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IParametre } from '../parametre.model';
import { ParametreService } from '../service/parametre.service';

@Component({
  templateUrl: './parametre-delete-dialog.component.html',
})
export class ParametreDeleteDialogComponent {
  parametre?: IParametre;

  constructor(protected parametreService: ParametreService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parametreService.delete(id).subscribe((res: any) => {
      if (res.ok === true) {
        Swal.fire({
          icon: 'success',
          title: 'Réussi ',
          text: 'Suppresion effectuée avec succès',
        });
      }

      this.activeModal.close('deleted');
    });
  }
}
