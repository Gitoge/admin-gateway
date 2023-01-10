import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPosteGrade } from '../poste-grade.model';

@Component({
  selector: 'jhi-poste-grade-detail',
  templateUrl: './poste-grade-detail.component.html',
})
export class PosteGradeDetailComponent implements OnInit {
  posteGrade: IPosteGrade | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posteGrade }) => {
      this.posteGrade = posteGrade;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
