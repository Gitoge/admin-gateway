import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParametre } from '../parametre.model';

@Component({
  selector: 'jhi-parametre-detail',
  templateUrl: './parametre-detail.component.html',
})
export class ParametreDetailComponent implements OnInit {
  parametre: IParametre | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parametre }) => {
      this.parametre = parametre;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
