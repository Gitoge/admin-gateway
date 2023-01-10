import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IHierarchie } from '../hierarchie.model';
import { HierarchieService } from '../service/hierarchie.service';

@Component({
  templateUrl: './hierarchie-delete-dialog.component.html',
})
export class HierarchieDeleteDialogComponent {
  hierarchie?: IHierarchie;

  constructor(protected hierarchieService: HierarchieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.hierarchieService.delete(id).subscribe(
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
      }
    );
  }
}
