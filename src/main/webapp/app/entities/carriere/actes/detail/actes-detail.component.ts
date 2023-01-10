import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActes } from '../actes.model';

@Component({
  selector: 'jhi-actes-detail',
  templateUrl: './actes-detail.component.html',
})
export class ActesDetailComponent implements OnInit {
  actes: IActes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actes }) => {
      this.actes = actes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
