import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrilleSoldeGlobal } from '../grille-solde-global.model';

@Component({
  selector: 'jhi-grille-solde-global-detail',
  templateUrl: './grille-solde-global-detail.component.html',
})
export class GrilleSoldeGlobalDetailComponent implements OnInit {
  grilleSoldeGlobal: IGrilleSoldeGlobal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grilleSoldeGlobal }) => {
      this.grilleSoldeGlobal = grilleSoldeGlobal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
