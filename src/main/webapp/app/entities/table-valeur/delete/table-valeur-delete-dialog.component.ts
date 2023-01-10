import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITableValeur } from '../table-valeur.model';
import { TableValeurService } from '../service/table-valeur.service';

@Component({
  templateUrl: './table-valeur-delete-dialog.component.html',
})
export class TableValeurDeleteDialogComponent {
  tableValeur?: ITableValeur;

  constructor(protected tableValeurService: TableValeurService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tableValeurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
