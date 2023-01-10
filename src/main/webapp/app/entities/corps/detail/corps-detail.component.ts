import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICorps } from '../corps.model';

@Component({
  selector: 'jhi-corps-detail',
  templateUrl: './corps-detail.component.html',
})
export class CorpsDetailComponent implements OnInit {
  corps: ICorps | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ corps }) => {
      this.corps = corps;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
