import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ITypeLocalite, TypeLocalite } from '../type-localite.model';
import { TypeLocaliteService } from '../service/type-localite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-type-localite-update',
  templateUrl: './type-localite-update.component.html',
})
export class TypeLocaliteUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;
  typeLocalite!: ITypeLocalite;
  typeMessage?: string;
  _success = new Subject<string>();

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  constructor(protected typeLocaliteService: TypeLocaliteService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeLocalite }) => {
      this.updateForm(typeLocalite);
      if (typeLocalite.id !== undefined && typeLocalite.id !== null) {
        this.titre = 'Modifier ce Type de Localité';
      } else {
        this.titre = 'Ajouter un Type de Localité';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeLocalite = this.createFromForm();
    if (typeLocalite.id !== undefined) {
      this.subscribeToSaveResponse(this.typeLocaliteService.update(typeLocalite));
    } else {
      this.subscribeToSaveResponse(this.typeLocaliteService.create(typeLocalite));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeLocalite>>): void {
    result.subscribe(
      (res: HttpResponse<ITypeLocalite>) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
  }

  protected onSaveSuccess(typeLocalite: ITypeLocalite | null): void {
    if (typeLocalite !== null) {
      this.typeLocalite = typeLocalite;

      this.isSaving = false;
      (async () => {
        // Do something before delay
        this.afficheMessage('Opération effectuée avec succès.', 'success');

        await this.delay(3000);

        this.refresh();

        // Do something after
      })();

      if (this.typeLocalite.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Type de localité <b>${
            typeLocalite?.libelle ?? ''
          }</b> enregistré avec succès</h4>`
        );
      }

      this.previousState();
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(typeLocalite: ITypeLocalite): void {
    this.editForm.patchValue({
      id: typeLocalite.id,
      code: typeLocalite.code,
      libelle: typeLocalite.libelle,
      description: typeLocalite.description,
    });
  }

  protected createFromForm(): ITypeLocalite {
    return {
      ...new TypeLocalite(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
