import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeReglement } from '../type-reglement.model';
import { TypeReglementService } from '../service/type-reglement.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './type-reglement-delete-dialog.component.html',
})
export class TypeReglementDeleteDialogComponent {
  typeReglement?: ITypeReglement;

  constructor(protected typeReglementService: TypeReglementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeReglementService.delete(id).subscribe(
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
