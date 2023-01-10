import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IService } from '../service.model';
import { ServiceService } from '../service/service.service';

@Component({
  templateUrl: './service-delete-dialog.component.html',
})
export class ServiceDeleteDialogComponent {
  service?: IService;

  constructor(protected serviceService: ServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceService.delete(id).subscribe(
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
