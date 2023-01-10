import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IDestinataires } from '../destinataires.model';
import { DestinatairesService } from '../service/destinataires.service';

@Component({
  templateUrl: './destinataires-delete-dialog.component.html',
})
export class DestinatairesDeleteDialogComponent {
  destinataires?: IDestinataires;

  constructor(protected destinatairesService: DestinatairesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.destinatairesService.delete(id).subscribe(
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
  }
}
