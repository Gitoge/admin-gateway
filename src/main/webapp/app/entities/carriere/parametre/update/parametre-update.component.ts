import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParametre, Parametre } from '../parametre.model';
import { ParametreService } from '../service/parametre.service';

@Component({
  selector: 'jhi-parametre-update',
  templateUrl: './parametre-update.component.html',
})
export class ParametreUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    libelle: [null, [Validators.required]],
    valeur: [null, [Validators.required]],
  });

  constructor(protected parametreService: ParametreService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parametre }) => {
      this.updateForm(parametre);
      if (parametre.id === undefined) {
        this.titre = 'Ajouter un nouveau paramètre : ';
      } else {
        this.titre = 'Modifier ce paraètre : ';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parametre = this.createFromForm();
    if (parametre.id !== undefined) {
      this.subscribeToSaveResponse(this.parametreService.update(parametre));
    } else {
      this.subscribeToSaveResponse(this.parametreService.create(parametre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParametre>>): void {
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

  protected updateForm(parametre: IParametre): void {
    this.editForm.patchValue({
      id: parametre.id,
      code: parametre.code,
      libelle: parametre.libelle,
      valeur: parametre.valeur,
    });
  }

  protected createFromForm(): IParametre {
    return {
      ...new Parametre(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      valeur: this.editForm.get(['valeur'])!.value,
    };
  }
}
