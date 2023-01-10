import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrilleIndiciaire } from '../grille-indiciaire.model';

@Component({
  selector: 'jhi-grille-indiciaire-detail',
  templateUrl: './grille-indiciaire-detail.component.html',
})
export class GrilleIndiciaireDetailComponent implements OnInit {
  grilleIndiciaire: IGrilleIndiciaire | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grilleIndiciaire }) => {
      this.grilleIndiciaire = grilleIndiciaire;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
