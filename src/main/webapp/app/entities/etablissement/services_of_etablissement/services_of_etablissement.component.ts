import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

@Component({
  templateUrl: './services_of_etablissement.component.html',
})
export class ServicesOfEtablissementComponent {
  services: any;
  etablissement: any;

  constructor(protected pagesService: ServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pagesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
