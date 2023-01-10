import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReglement, Reglement } from '../reglement.model';
import { ReglementService } from '../service/reglement.service';
import { ITypeReglement } from 'app/entities/type-reglement/type-reglement.model';
import { TypeReglementService } from 'app/entities/type-reglement/service/type-reglement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-reglement-update',
  templateUrl: './reglement-update.component.html',
})
export class ReglementUpdateComponent implements OnInit {
  isSaving = false;

  typeReglementsSharedCollection: ITypeReglement[] = [];

  reglement!: IReglement;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [],
    complementinfos: [],
    commentaire: [],
    typereglement: [],
  });
  titre!: string;

  constructor(
    protected reglementService: ReglementService,
    protected typeReglementService: TypeReglementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reglement }) => {
      this.updateForm(reglement);
      if (reglement.id !== undefined && reglement.id !== null) {
        this.titre = 'Modifier réglement';
      } else {
        this.titre = 'Ajouter réglement';
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reglement = this.createFromForm();
    if (reglement.id !== undefined) {
      this.subscribeToSaveResponse(this.reglementService.update(reglement));
    } else {
      this.subscribeToSaveResponse(this.reglementService.create(reglement));
    }
  }

  trackTypeReglementById(_index: number, item: ITypeReglement): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReglement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: any) => this.onSaveSuccess(res.body),
      error: error => this.onSaveError(error),
    });
  }

  protected onSaveSuccess(reglement: IReglement): void {
    if (reglement !== null) {
      this.reglement = reglement;

      this.isSaving = false;

      if (this.reglement.id !== undefined) {
        Swal.fire({
          icon: 'success',
          title: 'Réussi ',
          text: `Type Réglement ${reglement?.libelle ?? ''} enregistré avec succès`,
        });
      }

      this.previousState();
    }
  }

  protected onSaveError(err: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur...',
      text: err.error.message,
    });
    // console.error(err.error.message);
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(reglement: IReglement): void {
    this.editForm.patchValue({
      id: reglement.id,
      code: reglement.code,
      libelle: reglement.libelle,
      complementinfos: reglement.complementinfos,
      commentaire: reglement.commentaire,
      typereglement: reglement.typereglement,
    });

    this.typeReglementsSharedCollection = this.typeReglementService.addTypeReglementToCollectionIfMissing(
      this.typeReglementsSharedCollection,
      reglement.typereglement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeReglementService
      .query()
      .pipe(map((res: HttpResponse<ITypeReglement[]>) => res.body ?? []))
      .pipe(
        map((typeReglements: ITypeReglement[]) =>
          this.typeReglementService.addTypeReglementToCollectionIfMissing(typeReglements, this.editForm.get('typereglement')!.value)
        )
      )
      .subscribe((typeReglements: ITypeReglement[]) => (this.typeReglementsSharedCollection = typeReglements));
  }

  protected createFromForm(): IReglement {
    return {
      ...new Reglement(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      complementinfos: this.editForm.get(['complementinfos'])!.value,
      commentaire: this.editForm.get(['commentaire'])!.value,
      typereglement: this.editForm.get(['typereglement'])!.value,
    };
  }
}
