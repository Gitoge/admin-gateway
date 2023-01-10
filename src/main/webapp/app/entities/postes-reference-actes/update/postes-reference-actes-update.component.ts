import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPostesReferenceActes, PostesReferenceActes } from '../postes-reference-actes.model';
import { PostesReferenceActesService } from '../service/postes-reference-actes.service';
import { IPostes } from '../../postes/postes.model';
import { PostesService } from '../../postes/service/postes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-postes-reference-actes-update',
  templateUrl: './postes-reference-actes-update.component.html',
})
export class PostesReferenceActesUpdateComponent implements OnInit {
  isSaving = false;
  postes: IPostes[] = [];
  postesReferenceActe!: IPostesReferenceActes;

  editForm = this.fb.group({
    id: [],
    postes: [null, [Validators.required]],
  });

  constructor(
    protected postesReferenceActesService: PostesReferenceActesService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ postesReferenceActes }) => {
      this.updateForm(postesReferenceActes);
    });
    this.postesService
      .query()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postes = postes));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const postesReferenceActes = this.createFromForm();
    if (postesReferenceActes.id !== undefined) {
      this.subscribeToSaveResponse(this.postesReferenceActesService.update(postesReferenceActes));
    } else {
      this.subscribeToSaveResponse(this.postesReferenceActesService.create(postesReferenceActes));
    }
  }
  trackPostesById(index: number, item: IPostes): number {
    return item.id!;
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPostesReferenceActes>>): void {
    result.subscribe(
      (res: HttpResponse<IPostesReferenceActes>) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
    this.isSaving = false;
  }

  protected onSaveSuccess(postesReferenceActe: IPostesReferenceActes | null): void {
    if (postesReferenceActe !== null) {
      this.postesReferenceActe = postesReferenceActe;

      this.isSaving = false;

      if (this.postesReferenceActe.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Poste Reference Acte <b>${
            postesReferenceActe?.postes?.libelle ?? ''
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

  protected updateForm(postesReferenceActes: IPostesReferenceActes): void {
    this.editForm.patchValue({
      id: postesReferenceActes.id,
      postes: postesReferenceActes.postes,
    });
  }

  protected createFromForm(): IPostesReferenceActes {
    return {
      ...new PostesReferenceActes(),
      id: this.editForm.get(['id'])!.value,
      postes: this.editForm.get(['postes'])!.value,
    };
  }
}
