import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEtablissementBancaire } from '../etablissement-bancaire.model';

@Component({
  selector: 'jhi-etablissement-bancaire-detail',
  templateUrl: './etablissement-bancaire-detail.component.html',
})
export class EtablissementBancaireDetailComponent implements OnInit {
  etablissementBancaire: IEtablissementBancaire | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etablissementBancaire }) => {
      this.etablissementBancaire = etablissementBancaire;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
