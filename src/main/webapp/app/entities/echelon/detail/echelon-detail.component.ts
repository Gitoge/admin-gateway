import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEchelon } from '../echelon.model';

@Component({
  selector: 'jhi-echelon-detail',
  templateUrl: './echelon-detail.component.html',
})
export class EchelonDetailComponent implements OnInit {
  echelon: IEchelon | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ echelon }) => {
      this.echelon = echelon;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
