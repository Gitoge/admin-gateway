import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPosteGrade, PosteGrade } from '../poste-grade.model';
import { PosteGradeService } from '../service/poste-grade.service';
import { IGrade } from '../../../grade/grade.model';
import { GradeService } from '../../../grade/service/grade.service';
import { IPostes } from '../../../postes/postes.model';
import { PostesService } from '../../../postes/service/postes.service';

@Component({
  selector: 'jhi-poste-grade-update',
  templateUrl: './poste-grade-update.component.html',
})
export class PosteGradeUpdateComponent implements OnInit {
  isSaving = false;
  grade: IGrade[] = [];
  postes: IPostes[] = [];

  editForm = this.fb.group({
    id: [],
    grade: [],
    postes: [],
    codeGrade: [],
    codePoste: [],
  });

  constructor(
    protected posteGradeService: PosteGradeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected gradeService: GradeService,
    protected postesService: PostesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posteGrade }) => {
      this.updateForm(posteGrade);
    });
    this.loadGrade();
  }

  previousState(): void {
    window.history.back();
  }
  loadGrade(): void {
    this.gradeService
      .query()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade, this.editForm.get('grade')!.value)))
      .subscribe((grade: IGrade[]) => (this.grade = grade));

    this.postesService
      .query()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postes = postes));
  }
  trackGradeById(index: number, item: IGrade): number {
    return item.id!;
  }
  save(): void {
    this.isSaving = true;
    const posteGrade = this.createFromForm();
    console.error('code Grade ', this.editForm.get(['grade'])!.value);
    if (posteGrade.id !== undefined) {
      this.subscribeToSaveResponse(this.posteGradeService.update(posteGrade));
    } else {
      this.subscribeToSaveResponse(this.posteGradeService.create(posteGrade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPosteGrade>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(posteGrade: IPosteGrade): void {
    this.editForm.patchValue({
      id: posteGrade.id,
      codeGrade: posteGrade.codeGrade,
      codePoste: posteGrade.codePoste,
    });
  }

  protected createFromForm(): IPosteGrade {
    return {
      ...new PosteGrade(),
      id: this.editForm.get(['id'])!.value,
      codeGrade: this.editForm.get(['grade'])!.value?.code,
      codePoste: this.editForm.get(['postes'])!.value?.code,
    };
  }
}
