import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDirection } from '../direction.model';

@Component({
  selector: 'jhi-direction-detail',
  templateUrl: './direction-detail.component.html',
})
export class DirectionDetailComponent implements OnInit {
  direction: IDirection | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ direction }) => {
      this.direction = direction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
