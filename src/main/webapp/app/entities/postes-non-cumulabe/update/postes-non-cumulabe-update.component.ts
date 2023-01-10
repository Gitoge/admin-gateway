import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPostesNonCumulabe, PostesNonCumulabe } from '../postes-non-cumulabe.model';
import { PostesNonCumulabeService } from '../service/postes-non-cumulabe.service';
import { IPostes } from '../../postes/postes.model';
import { PostesService } from '../../postes/service/postes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-postes-non-cumulabe-update',
  templateUrl: './postes-non-cumulabe-update.component.html',
})
export class PostesNonCumulabeUpdateComponent implements OnInit {
  isSaving = false;
  poste1: IPostes[] = [];
  poste2: IPostes[] = [];
  ngPoste1: any;
  titre = '';

  editForm = this.fb.group({
    id: [],
    codePoste1: [],
    codePoste2: [],
  });

  constructor(
    protected postesNonCumulabeService: PostesNonCumulabeService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ postesNonCumulabe }) => {
      if (postesNonCumulabe.id === undefined) {
        this.titre = 'Ajout Postes Non Cumulables';
      } else {
        this.titre = 'Modification Postes Non Cumulables';
      }
      this.updateForm(postesNonCumulabe);
    });
    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const postesNonCumulabe = this.createFromForm();

    if (postesNonCumulabe.id !== undefined) {
      this.subscribeToSaveResponse(this.postesNonCumulabeService.update(postesNonCumulabe));
    } else {
      if (postesNonCumulabe.codePoste1 === postesNonCumulabe.codePoste2) {
        Swal.fire(`Erreur`, 'Les deux codes ne doivent pas etre identiques', 'error');
        this.isSaving = false;
      } else {
        this.subscribeToSaveResponse(this.postesNonCumulabeService.create(postesNonCumulabe));
      }
    }
  }
  protected loadRelationshipsOptions(): void {
    this.postesService
      .findAll()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('codePoste1')!.value)))
      .subscribe((postes: IPostes[]) => (this.poste1 = postes));

    this.postesService
      .findAll()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('codePoste2')!.value)))
      .subscribe((postes: IPostes[]) => (this.poste2 = postes));
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPostesNonCumulabe>>): void {
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

  protected updateForm(postesNonCumulabe: IPostesNonCumulabe): void {
    this.editForm.patchValue({
      id: postesNonCumulabe.id,
      codePoste1: postesNonCumulabe.codePoste1,
      codePoste2: postesNonCumulabe.codePoste2,
    });
  }

  protected createFromForm(): IPostesNonCumulabe {
    return {
      ...new PostesNonCumulabe(),
      id: this.editForm.get(['id'])!.value,
      codePoste1: this.editForm.get(['codePoste1'])!.value?.code,
      codePoste2: this.editForm.get(['codePoste2'])!.value?.code,
    };
  }
}
