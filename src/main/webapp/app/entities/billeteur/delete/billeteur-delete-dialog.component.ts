import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IBilleteur } from '../billeteur.model';
import { BilleteurService } from '../service/billeteur.service';

@Component({
  templateUrl: './billeteur-delete-dialog.component.html',
})
export class BilleteurDeleteDialogComponent {
  billeteur?: IBilleteur;

  constructor(protected billeteurService: BilleteurService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.billeteurService.delete(id).subscribe(
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
