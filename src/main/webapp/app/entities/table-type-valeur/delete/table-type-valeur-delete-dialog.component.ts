import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITableTypeValeur } from '../table-type-valeur.model';
import { TableTypeValeurService } from '../service/table-type-valeur.service';

@Component({
  templateUrl: './table-type-valeur-delete-dialog.component.html',
})
export class TableTypeValeurDeleteDialogComponent {
  tableTypeValeur?: ITableTypeValeur;

  constructor(protected tableTypeValeurService: TableTypeValeurService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tableTypeValeurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
