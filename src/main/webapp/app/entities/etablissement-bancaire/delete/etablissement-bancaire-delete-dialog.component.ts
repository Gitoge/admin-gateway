import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { IEtablissementBancaire } from '../etablissement-bancaire.model';
import { EtablissementBancaireService } from '../service/etablissement-bancaire.service';

@Component({
  templateUrl: './etablissement-bancaire-delete-dialog.component.html',
})
export class EtablissementBancaireDeleteDialogComponent {
  etablissementBancaire?: IEtablissementBancaire;

  constructor(protected etablissementBancaireService: EtablissementBancaireService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etablissementBancaireService.delete(id).subscribe(
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
