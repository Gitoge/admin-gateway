import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISituationFamiliale } from '../situation-familiale.model';

@Component({
  selector: 'jhi-situation-familiale-detail',
  templateUrl: './situation-familiale-detail.component.html',
})
export class SituationFamilialeDetailComponent implements OnInit {
  situationFamiliale: ISituationFamiliale | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ situationFamiliale }) => {
      this.situationFamiliale = situationFamiliale;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
