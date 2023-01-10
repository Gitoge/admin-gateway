import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPriseEnCompte } from '../prise-en-compte.model';

@Component({
  selector: 'jhi-prise-en-compte-detail',
  templateUrl: './prise-en-compte-detail.component.html',
})
export class PriseEnCompteDetailComponent implements OnInit {
  priseencompte: IPriseEnCompte | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ priseencompte }) => {
      this.priseencompte = priseencompte;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
