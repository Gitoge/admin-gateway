import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExclusionTaux, ExclusionTaux } from '../exclusion-taux.model';
import { ExclusionTauxService } from '../service/exclusion-taux.service';
import { IEtablissement } from '../../../etablissement/etablissement.model';
import { EtablissementService } from '../../../etablissement/service/etablissement.service';
import { PostesService } from 'app/entities/postes/service/postes.service';
import { IPostes } from '../../postes/postes.model';

@Component({
  selector: 'jhi-exclusion-taux-update',
  templateUrl: './exclusion-taux-update.component.html',
})
export class ExclusionTauxUpdateComponent implements OnInit {
  isSaving = false;
  titre = '';
  etablissement: IEtablissement[] = [];
  postes: IPostes[] = [];
  exclusionTaux!: IExclusionTaux;
  editForm = this.fb.group({
    id: [],
    etablissementId: [],
    valeur: [null, [Validators.required]],
  });

  constructor(
    protected exclusionTauxService: ExclusionTauxService,
    protected activatedRoute: ActivatedRoute,
    protected postesService: PostesService,
    protected etablissementService: EtablissementService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exclusionTaux }) => {
      this.exclusionTaux = exclusionTaux;
      if (exclusionTaux?.id !== undefined) {
        this.titre = 'Modifier Exclusion taux';
      } else {
        this.titre = 'Ajouter Exclusion taux';
      }
      this.updateForm(exclusionTaux);
      this.etablissementService
        .findAll()
        .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
        .pipe(
          map((etablissement: IEtablissement[]) =>
            this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissementId')!.value)
          )
        )
        .subscribe((etablissement: IEtablissement[]) => (this.etablissement = etablissement));

      this.postesService
        .findAll()
        .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
        .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes)))
        .subscribe((postes: IPostes[]) => (this.postes = postes));
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.exclusionTaux.etablissementId = this.exclusionTaux.etablissement?.id;
    this.exclusionTaux.posteId = this.exclusionTaux.postes?.id;
    this.exclusionTaux.codePoste = this.exclusionTaux.postes?.code;
    if (this.exclusionTaux.id !== undefined) {
      this.subscribeToSaveResponse(this.exclusionTauxService.update(this.exclusionTaux));
    } else {
      this.subscribeToSaveResponse(this.exclusionTauxService.create(this.exclusionTaux));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExclusionTaux>>): void {
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

  protected updateForm(exclusionTaux: IExclusionTaux): void {
    this.editForm.patchValue({
      id: exclusionTaux.id,
      etablissementId: exclusionTaux.etablissementId,
      valeur: exclusionTaux.valeur,
    });
  }

  protected createFromForm(): IExclusionTaux {
    return {
      ...new ExclusionTaux(),
      id: this.editForm.get(['id'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value?.id,
      valeur: this.editForm.get(['valeur'])!.value,
    };
  }
}
