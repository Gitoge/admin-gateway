import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeDestinataires } from '../type-destinataires.model';
import { TypeDestinatairesService } from '../service/type-destinataires.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './type-destinataires-delete-dialog.component.html',
})
export class TypeDestinatairesDeleteDialogComponent {
  typeDestinataires?: ITypeDestinataires;

  constructor(protected typeDestinatairesService: TypeDestinatairesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeDestinatairesService.delete(id).subscribe(
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
