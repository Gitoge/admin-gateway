import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmoluments } from '../emoluments.model';

@Component({
  selector: 'jhi-emoluments-detail',
  templateUrl: './emoluments-detail.component.html',
})
export class EmolumentsDetailComponent implements OnInit {
  emoluments: IEmoluments | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emoluments }) => {
      this.emoluments = emoluments;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
