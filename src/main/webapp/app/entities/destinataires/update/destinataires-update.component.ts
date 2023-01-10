import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDestinataires, Destinataires } from '../destinataires.model';
import { DestinatairesService } from '../service/destinataires.service';
import { ITypeDestinataires } from 'app/entities/type-destinataires/type-destinataires.model';
import { TypeDestinatairesService } from 'app/entities/type-destinataires/service/type-destinataires.service';

@Component({
  selector: 'jhi-destinataires-update',
  templateUrl: './destinataires-update.component.html',
})
export class DestinatairesUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;
  typeDestinatairesSharedCollection: ITypeDestinataires[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [],
    prenom: [],
    nom: [],
    adresse: [],
    comptebancaire: [],
    typedestinataires: [],
  });
  isBanque!: boolean;

  constructor(
    protected destinatairesService: DestinatairesService,
    protected typeDestinatairesService: TypeDestinatairesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ destinataires }) => {
      this.updateForm(destinataires);
      if (destinataires.id !== undefined && destinataires.id !== null) {
        this.titre = 'Modifier ce Destinataire';
      } else {
        this.titre = 'Ajouter un Destinataire';
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const destinataires = this.createFromForm();
    if (destinataires.id !== undefined) {
      this.subscribeToSaveResponse(this.destinatairesService.update(destinataires));
    } else {
      this.subscribeToSaveResponse(this.destinatairesService.create(destinataires));
    }
  }

  trackTypeDestinatairesById(_index: number, item: ITypeDestinataires): number {
    return item.id!;
  }

  onTypeDestinataireChange(type: any): void {
    if (type.code !== null) {
      switch (type.code) {
        case '01':
          this.isBanque = true;
          break;
        default:
          this.isBanque = false;
          this.editForm.patchValue({
            comptebancaire: null,
          });
          break;
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDestinataires>>): void {
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

  protected updateForm(destinataires: IDestinataires): void {
    this.editForm.patchValue({
      id: destinataires.id,
      code: destinataires.code,
      libelle: destinataires.libelle,
      prenom: destinataires.prenom,
      nom: destinataires.nom,
      adresse: destinataires.adresse,
      comptebancaire: destinataires.comptebancaire,
      typedestinataires: destinataires.typedestinataires,
    });

    this.typeDestinatairesSharedCollection = this.typeDestinatairesService.addTypeDestinatairesToCollectionIfMissing(
      this.typeDestinatairesSharedCollection,
      destinataires.typedestinataires
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeDestinatairesService
      .query()
      .pipe(map((res: HttpResponse<ITypeDestinataires[]>) => res.body ?? []))
      .pipe(
        map((typeDestinataires: ITypeDestinataires[]) =>
          this.typeDestinatairesService.addTypeDestinatairesToCollectionIfMissing(
            typeDestinataires,
            this.editForm.get('typedestinataires')!.value
          )
        )
      )
      .subscribe((typeDestinataires: ITypeDestinataires[]) => (this.typeDestinatairesSharedCollection = typeDestinataires));
  }

  protected createFromForm(): IDestinataires {
    return {
      ...new Destinataires(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      comptebancaire: this.editForm.get(['comptebancaire'])!.value,
      typedestinataires: this.editForm.get(['typedestinataires'])!.value,
    };
  }
}
