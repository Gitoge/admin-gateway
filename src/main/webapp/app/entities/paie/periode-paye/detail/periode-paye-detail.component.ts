import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPeriodePaye } from '../periode-paye.model';

@Component({
  selector: 'jhi-periode-paye-detail',
  templateUrl: './periode-paye-detail.component.html',
})
export class PeriodePayeDetailComponent implements OnInit {
  periodePaye: IPeriodePaye | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ periodePaye }) => {
      this.periodePaye = periodePaye;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
