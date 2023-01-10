import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExercice } from '../exercice.model';

@Component({
  selector: 'jhi-exercice-detail',
  templateUrl: './exercice-detail.component.html',
})
export class ExerciceDetailComponent implements OnInit {
  exercice: IExercice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exercice }) => {
      this.exercice = exercice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
