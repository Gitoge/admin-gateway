import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypePosition } from '../type-position.model';
import { TypePositionService } from '../service/type-position.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './type-position-delete-dialog.component.html',
})
export class TypePositionDeleteDialogComponent {
  typePosition?: ITypePosition;

  constructor(protected typePositionService: TypePositionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typePositionService.delete(id).subscribe(
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
