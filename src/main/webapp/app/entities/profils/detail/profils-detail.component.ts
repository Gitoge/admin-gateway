import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProfils } from '../profils.model';

@Component({
  selector: 'jhi-profils-detail',
  templateUrl: './profils-detail.component.html',
})
export class ProfilsDetailComponent implements OnInit {
  profils: IProfils | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profils }) => {
      this.profils = profils;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
