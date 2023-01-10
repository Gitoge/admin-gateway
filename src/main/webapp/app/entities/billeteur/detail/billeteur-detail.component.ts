import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBilleteur } from '../billeteur.model';
import { EtablissementService } from '../../etablissement/service/etablissement.service';

@Component({
  selector: 'jhi-billeteur-detail',
  templateUrl: './billeteur-detail.component.html',
})
export class BilleteurDetailComponent implements OnInit {
  billeteur: IBilleteur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billeteur }) => {
      this.billeteur = billeteur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
