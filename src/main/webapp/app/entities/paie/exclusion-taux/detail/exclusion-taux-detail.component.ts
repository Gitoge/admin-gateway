import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExclusionTaux } from '../exclusion-taux.model';

@Component({
  selector: 'jhi-exclusion-taux-detail',
  templateUrl: './exclusion-taux-detail.component.html',
})
export class ExclusionTauxDetailComponent implements OnInit {
  exclusionTaux: IExclusionTaux | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exclusionTaux }) => {
      this.exclusionTaux = exclusionTaux;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
