import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeEtablissement } from '../type-etablissement.model';
import { TypeEtablissementService } from '../service/type-etablissement.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './type-etablissement-delete-dialog.component.html',
})
export class TypeEtablissementDeleteDialogComponent {
  typeEtablissement?: ITypeEtablissement;

  constructor(protected typeEtablissementService: TypeEtablissementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeEtablissementService.delete(id).subscribe(
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
