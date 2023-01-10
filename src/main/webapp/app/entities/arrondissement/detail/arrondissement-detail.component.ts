import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArrondissement } from '../arrondissement.model';

@Component({
  selector: 'jhi-arrondissement-detail',
  templateUrl: './arrondissement-detail.component.html',
})
export class ArrondissementDetailComponent implements OnInit {
  arrondissement: IArrondissement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arrondissement }) => {
      this.arrondissement = arrondissement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
