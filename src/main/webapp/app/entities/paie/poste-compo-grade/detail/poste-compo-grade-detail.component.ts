import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPosteCompoGrade } from '../poste-compo-grade.model';

@Component({
  selector: 'jhi-poste-compo-grade-detail',
  templateUrl: './poste-compo-grade-detail.component.html',
})
export class PosteCompoGradeDetailComponent implements OnInit {
  posteCompoGrade: IPosteCompoGrade | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posteCompoGrade }) => {
      this.posteCompoGrade = posteCompoGrade;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
