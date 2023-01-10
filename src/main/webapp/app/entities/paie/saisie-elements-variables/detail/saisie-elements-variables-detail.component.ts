import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISaisieElementsVariables } from '../saisie-elements-variables.model';

@Component({
  selector: 'jhi-saisie-elements-variables-detail',
  templateUrl: './saisie-elements-variables-detail.component.html',
})
export class SaisieElementsVariablesDetailComponent implements OnInit {
  saisieElementsVariables: ISaisieElementsVariables | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saisieElementsVariables }) => {
      this.saisieElementsVariables = saisieElementsVariables;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
