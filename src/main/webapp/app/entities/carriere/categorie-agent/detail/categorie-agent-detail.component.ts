import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategorieAgent } from '../categorie-agent.model';

@Component({
  selector: 'jhi-categorie-agent-detail',
  templateUrl: './categorie-agent-detail.component.html',
})
export class CategorieAgentDetailComponent implements OnInit {
  categorieAgent: ICategorieAgent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieAgent }) => {
      this.categorieAgent = categorieAgent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
