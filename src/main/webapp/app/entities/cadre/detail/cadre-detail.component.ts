import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICadre } from '../cadre.model';

@Component({
  selector: 'jhi-cadre-detail',
  templateUrl: './cadre-detail.component.html',
})
export class CadreDetailComponent implements OnInit {
  cadre: ICadre | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cadre }) => {
      this.cadre = cadre;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
