import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDestinataires } from '../destinataires.model';

@Component({
  selector: 'jhi-destinataires-detail',
  templateUrl: './destinataires-detail.component.html',
})
export class DestinatairesDetailComponent implements OnInit {
  destinataires: IDestinataires | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ destinataires }) => {
      this.destinataires = destinataires;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
