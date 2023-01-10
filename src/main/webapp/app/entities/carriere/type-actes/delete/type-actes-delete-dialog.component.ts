import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeActes } from '../type-actes.model';
import { TypeActesService } from '../service/type-actes.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './type-actes-delete-dialog.component.html',
})
export class TypeActesDeleteDialogComponent {
  typeActes?: ITypeActes;

  constructor(protected typeActesService: TypeActesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeActesService.delete(id).subscribe(
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
