import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IGrilleSoldeGlobal } from '../grille-solde-global.model';
import { GrilleSoldeGlobalService } from '../service/grille-solde-global.service';

@Component({
  templateUrl: './grille-solde-global-delete-dialog.component.html',
})
export class GrilleSoldeGlobalDeleteDialogComponent {
  grilleSoldeGlobal?: IGrilleSoldeGlobal;

  constructor(protected grilleSoldeGlobalService: GrilleSoldeGlobalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grilleSoldeGlobalService.delete(id).subscribe(
      (res: any) => {
        this.activeModal.close('deleted');
        if (res.ok === true) {
          Swal.fire({
            icon: 'success',
            title: 'Réussi ',
            text: 'Suppresion effectuée avec succès',
          });
        }
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
    this.cancel();
  }
}
