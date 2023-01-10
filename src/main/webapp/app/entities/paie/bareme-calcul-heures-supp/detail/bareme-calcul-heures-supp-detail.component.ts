import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';

@Component({
  selector: 'jhi-bareme-calcul-heures-supp-detail',
  templateUrl: './bareme-calcul-heures-supp-detail.component.html',
})
export class BaremeCalculHeuresSuppDetailComponent implements OnInit {
  baremeCalculHeuresSupp: IBaremeCalculHeuresSupp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ baremeCalculHeuresSupp }) => {
      this.baremeCalculHeuresSupp = baremeCalculHeuresSupp;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
