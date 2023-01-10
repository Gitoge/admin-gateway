import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEnfant } from '../enfant.model';

@Component({
  selector: 'jhi-enfant-detail',
  templateUrl: './enfant-detail.component.html',
})
export class EnfantDetailComponent implements OnInit {
  enfant: IEnfant | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enfant }) => {
      this.enfant = enfant;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
