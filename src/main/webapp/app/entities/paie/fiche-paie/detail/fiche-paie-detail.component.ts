import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFichePaie } from '../fiche-paie.model';

@Component({
  selector: 'jhi-fiche-paie-detail',
  templateUrl: './fiche-paie-detail.component.html',
})
export class FichePaieDetailComponent implements OnInit {
  fichePaie: IFichePaie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fichePaie }) => {
      this.fichePaie = fichePaie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
