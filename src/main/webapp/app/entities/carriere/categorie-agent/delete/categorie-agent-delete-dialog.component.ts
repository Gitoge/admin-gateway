import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategorieAgent } from '../categorie-agent.model';
import { CategorieAgentService } from '../service/categorie-agent.service';

@Component({
  templateUrl: './categorie-agent-delete-dialog.component.html',
})
export class CategorieAgentDeleteDialogComponent {
  categorieAgent?: ICategorieAgent;

  constructor(protected categorieAgentService: CategorieAgentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categorieAgentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
