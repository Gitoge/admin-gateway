import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICategorieAgent, CategorieAgent } from '../categorie-agent.model';
import { CategorieAgentService } from '../service/categorie-agent.service';

@Component({
  selector: 'jhi-categorie-agent-update',
  templateUrl: './categorie-agent-update.component.html',
})
export class CategorieAgentUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
  });

  constructor(
    protected categorieAgentService: CategorieAgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieAgent }) => {
      if (categorieAgent.id === undefined) {
        const today = dayjs().startOf('day');
        categorieAgent.dateInsert = today;
        categorieAgent.dateUpdate = today;
        this.titre = 'Ajouter une catégorie Agent ';
      } else {
        this.titre = 'Modifier cette catégorie Agent : ';
      }

      this.updateForm(categorieAgent);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categorieAgent = this.createFromForm();
    if (categorieAgent.id !== undefined) {
      this.subscribeToSaveResponse(this.categorieAgentService.update(categorieAgent));
    } else {
      this.subscribeToSaveResponse(this.categorieAgentService.create(categorieAgent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorieAgent>>): void {
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

  protected updateForm(categorieAgent: ICategorieAgent): void {
    this.editForm.patchValue({
      id: categorieAgent.id,
      code: categorieAgent.code,
      libelle: categorieAgent.libelle,
      description: categorieAgent.description,
      userInsertId: categorieAgent.userInsertId,
      userUpdateId: categorieAgent.userUpdateId,
      dateInsert: categorieAgent.dateInsert ? categorieAgent.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: categorieAgent.dateUpdate ? categorieAgent.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): ICategorieAgent {
    return {
      ...new CategorieAgent(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
