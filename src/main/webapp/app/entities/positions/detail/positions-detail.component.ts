import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPositions } from '../positions.model';

@Component({
  selector: 'jhi-positions-detail',
  templateUrl: './positions-detail.component.html',
})
export class PositionsDetailComponent implements OnInit {
  positions: IPositions | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positions }) => {
      this.positions = positions;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
