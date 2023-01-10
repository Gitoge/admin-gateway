import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPositionsAgent } from '../positions-agent.model';

@Component({
  selector: 'jhi-positions-agent-detail',
  templateUrl: './positions-agent-detail.component.html',
})
export class PositionsAgentDetailComponent implements OnInit {
  positionsAgent: IPositionsAgent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positionsAgent }) => {
      this.positionsAgent = positionsAgent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
