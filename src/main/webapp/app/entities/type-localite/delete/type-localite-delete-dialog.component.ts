import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeLocalite } from '../type-localite.model';
import { TypeLocaliteService } from '../service/type-localite.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './type-localite-delete-dialog.component.html',
})
export class TypeLocaliteDeleteDialogComponent {
  typeLocalite?: ITypeLocalite;

  errorMessage!: any;
  constructor(protected typeLocaliteService: TypeLocaliteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeLocaliteService.delete(id).subscribe(
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
    this.activeModal.dismiss();
  }
}
