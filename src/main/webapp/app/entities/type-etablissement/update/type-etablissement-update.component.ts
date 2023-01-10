import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ITypeEtablissement, TypeEtablissement } from '../type-etablissement.model';
import { TypeEtablissementService } from '../service/type-etablissement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-type-etablissement-update',
  templateUrl: './type-etablissement-update.component.html',
})
export class TypeEtablissementUpdateComponent implements OnInit {
  isSaving = false;
  displayStyle = 'none';

  titre!: string;
  typeEtablissement!: ITypeEtablissement;
  typeMessage?: string;
  _success = new Subject<string>();

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  constructor(
    protected typeEtablissementService: TypeEtablissementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeEtablissement }) => {
      this.updateForm(typeEtablissement);
      if (typeEtablissement.id !== undefined && typeEtablissement.id !== null) {
        this.titre = "Modifier ce Type d'Etablissement";
      } else {
        this.titre = "Ajouter un Type d'Etablissement ";
      }
    });
  }

  openPopup(): void {
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    this.displayStyle = 'none';
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.displayStyle = 'block';
    this.isSaving = true;
    const typeEtablissement = this.createFromForm();
    if (typeEtablissement.id !== undefined) {
      this.subscribeToSaveResponse(this.typeEtablissementService.update(typeEtablissement));
    } else {
      this.subscribeToSaveResponse(this.typeEtablissementService.create(typeEtablissement));
    }
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  refresh(): void {
    window.location.reload();
  }

  public afficheMessage(msg: string, typeMessage?: string): void {
    this.typeMessage = typeMessage;
    this._success.next(msg);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeEtablissement>>): void {
    result.subscribe(
      (res: HttpResponse<ITypeEtablissement>) => this.onSaveSuccess(res.body),
      error => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(typeEtablissement: ITypeEtablissement | null): void {
    if (typeEtablissement !== null) {
      this.typeEtablissement = typeEtablissement;

      this.isSaving = false;

      if (this.typeEtablissement.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Type d'établissement <b>${
            typeEtablissement?.libelle ?? ''
          }</b> enregistré avec succès</h4>`
        );
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

  protected updateForm(typeEtablissement: ITypeEtablissement): void {
    this.editForm.patchValue({
      id: typeEtablissement.id,
      code: typeEtablissement.code,
      libelle: typeEtablissement.libelle,
      description: typeEtablissement.description,
    });
  }

  protected createFromForm(): ITypeEtablissement {
    return {
      ...new TypeEtablissement(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
