import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITableValeur } from '../table-valeur.model';

@Component({
  selector: 'jhi-table-valeur-detail',
  templateUrl: './table-valeur-detail.component.html',
})
export class TableValeurDetailComponent implements OnInit {
  tableValeur: ITableValeur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tableValeur }) => {
      this.tableValeur = tableValeur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
