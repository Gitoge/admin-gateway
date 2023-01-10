import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISaisieEmoluments } from '../saisie-emoluments.model';

@Component({
  selector: 'jhi-saisie-emoluments-detail',
  templateUrl: './saisie-emoluments-detail.component.html',
})
export class SaisieEmolumentsDetailComponent implements OnInit {
  saisieEmoluments: ISaisieEmoluments | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saisieEmoluments }) => {
      this.saisieEmoluments = saisieEmoluments;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
