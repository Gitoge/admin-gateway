import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmplois } from '../emplois.model';

@Component({
  selector: 'jhi-emplois-detail',
  templateUrl: './emplois-detail.component.html',
})
export class EmploisDetailComponent implements OnInit {
  emplois: IEmplois | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emplois }) => {
      this.emplois = emplois;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
