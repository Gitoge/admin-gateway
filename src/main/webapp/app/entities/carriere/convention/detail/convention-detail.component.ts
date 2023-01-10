import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConvention } from '../convention.model';

@Component({
  selector: 'jhi-convention-detail',
  templateUrl: './convention-detail.component.html',
})
export class ConventionDetailComponent implements OnInit {
  convention: IConvention | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ convention }) => {
      this.convention = convention;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
