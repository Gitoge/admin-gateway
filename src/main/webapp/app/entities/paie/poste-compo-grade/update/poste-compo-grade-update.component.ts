import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPosteCompoGrade, PosteCompoGrade } from '../poste-compo-grade.model';
import { PosteCompoGradeService } from '../service/poste-compo-grade.service';

@Component({
  selector: 'jhi-poste-compo-grade-update',
  templateUrl: './poste-compo-grade-update.component.html',
})
export class PosteCompoGradeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dateInsert: [],
    operateur: [],
    posteComposant: [],
    posteCompose: [],
    userInsertId: [],
    valeur: [],
  });

  constructor(
    protected posteCompoGradeService: PosteCompoGradeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posteCompoGrade }) => {
      if (posteCompoGrade.id === undefined) {
        const today = dayjs().startOf('day');
        posteCompoGrade.dateInsert = today;
      }

      this.updateForm(posteCompoGrade);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const posteCompoGrade = this.createFromForm();
    if (posteCompoGrade.id !== undefined) {
      this.subscribeToSaveResponse(this.posteCompoGradeService.update(posteCompoGrade));
    } else {
      this.subscribeToSaveResponse(this.posteCompoGradeService.create(posteCompoGrade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPosteCompoGrade>>): void {
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

  protected updateForm(posteCompoGrade: IPosteCompoGrade): void {
    this.editForm.patchValue({
      id: posteCompoGrade.id,
      dateInsert: posteCompoGrade.dateInsert ? posteCompoGrade.dateInsert.format(DATE_TIME_FORMAT) : null,
      operateur: posteCompoGrade.operateur,
      posteComposant: posteCompoGrade.posteComposant,
      posteCompose: posteCompoGrade.posteCompose,
      userInsertId: posteCompoGrade.userInsertId,
      valeur: posteCompoGrade.valeur,
    });
  }

  protected createFromForm(): IPosteCompoGrade {
    return {
      ...new PosteCompoGrade(),
      id: this.editForm.get(['id'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      operateur: this.editForm.get(['operateur'])!.value,
      posteComposant: this.editForm.get(['posteComposant'])!.value,
      posteCompose: this.editForm.get(['posteCompose'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      valeur: this.editForm.get(['valeur'])!.value,
    };
  }
}
