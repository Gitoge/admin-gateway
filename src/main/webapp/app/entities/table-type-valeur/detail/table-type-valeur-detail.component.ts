import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITableTypeValeur } from '../table-type-valeur.model';

@Component({
  selector: 'jhi-table-type-valeur-detail',
  templateUrl: './table-type-valeur-detail.component.html',
})
export class TableTypeValeurDetailComponent implements OnInit {
  tableTypeValeur: ITableTypeValeur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tableTypeValeur }) => {
      this.tableTypeValeur = tableTypeValeur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
