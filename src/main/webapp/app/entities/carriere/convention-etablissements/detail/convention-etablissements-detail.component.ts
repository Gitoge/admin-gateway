import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConventionEtablissements } from '../convention-etablissements.model';

@Component({
  selector: 'jhi-convention-etablissements-detail',
  templateUrl: './convention-etablissements-detail.component.html',
})
export class ConventionEtablissementsDetailComponent implements OnInit {
  conventionEtablissements: IConventionEtablissements | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conventionEtablissements }) => {
      this.conventionEtablissements = conventionEtablissements;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
