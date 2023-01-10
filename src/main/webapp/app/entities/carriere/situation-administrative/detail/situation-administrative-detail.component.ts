import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISituationAdministrative } from '../situation-administrative.model';

@Component({
  selector: 'jhi-situation-administrative-detail',
  templateUrl: './situation-administrative-detail.component.html',
})
export class SituationAdministrativeDetailComponent implements OnInit {
  situationAdministrative: ISituationAdministrative | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ situationAdministrative }) => {
      this.situationAdministrative = situationAdministrative;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
