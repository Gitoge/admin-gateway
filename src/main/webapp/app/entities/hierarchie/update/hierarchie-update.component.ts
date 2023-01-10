import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { IHierarchie, Hierarchie } from '../hierarchie.model';
import { HierarchieService } from '../service/hierarchie.service';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';

@Component({
  selector: 'jhi-hierarchie-update',
  templateUrl: './hierarchie-update.component.html',
})
export class HierarchieUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  postesSharedCollection: IPostes[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    borneInferieure: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[Z0-9]*$')]],
    borneSuperieure: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[Z0-9]*$')]],
    codEchelonIndiciare: [],
    hcadre: [],
    postes: [],
  });

  constructor(
    protected hierarchieService: HierarchieService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hierarchie }) => {
      this.updateForm(hierarchie);
      if (hierarchie.id !== undefined && hierarchie.id !== null) {
        this.titre = 'Modifier cette Hierarchie';
      } else {
        this.titre = 'Ajouter une Hierarchie';
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hierarchie = this.createFromForm();
    if (hierarchie.id !== undefined) {
      this.subscribeToSaveResponse(this.hierarchieService.update(hierarchie));
    } else {
      this.subscribeToSaveResponse(this.hierarchieService.create(hierarchie));
    }
  }

  trackPostesById(_index: number, item: IPostes): number {
    return item.id!;
  }

  getSelectedPostes(option: IPostes, selectedVals?: IPostes[]): IPostes {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHierarchie>>): void {
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

  protected updateForm(hierarchie: IHierarchie): void {
    this.editForm.patchValue({
      id: hierarchie.id,
      code: hierarchie.code,
      libelle: hierarchie.libelle,
      borneInferieure: hierarchie.borneInferieure,
      borneSuperieure: hierarchie.borneSuperieure,
      codEchelonIndiciare: hierarchie.codEchelonIndiciare,
      hcadre: hierarchie.hcadre,
      postes: hierarchie.postes,
    });

    this.postesSharedCollection = this.postesService.addPostesToCollectionIfMissing(
      this.postesSharedCollection,
      ...(hierarchie.postes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.postesService
      .query()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(
        map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, ...(this.editForm.get('postes')!.value ?? [])))
      )
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected createFromForm(): IHierarchie {
    return {
      ...new Hierarchie(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      borneInferieure: this.editForm.get(['borneInferieure'])!.value,
      borneSuperieure: this.editForm.get(['borneSuperieure'])!.value,
      codEchelonIndiciare: this.editForm.get(['codEchelonIndiciare'])!.value,
      hcadre: this.editForm.get(['hcadre'])!.value,
      postes: this.editForm.get(['postes'])!.value,
    };
  }
}
