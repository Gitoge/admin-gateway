import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrilleConvention } from '../grille-convention.model';

@Component({
  selector: 'jhi-grille-convention-detail',
  templateUrl: './grille-convention-detail.component.html',
})
export class GrilleConventionDetailComponent implements OnInit {
  grilleConvention: IGrilleConvention | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grilleConvention }) => {
      this.grilleConvention = grilleConvention;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
