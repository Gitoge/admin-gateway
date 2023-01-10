import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReglement } from '../reglement.model';

@Component({
  selector: 'jhi-reglement-detail',
  templateUrl: './reglement-detail.component.html',
})
export class ReglementDetailComponent implements OnInit {
  reglement: IReglement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reglement }) => {
      this.reglement = reglement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
