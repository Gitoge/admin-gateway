import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IIndices, Indices } from '../indices.model';
import { IndicesService } from '../service/indices.service';

@Component({
  selector: 'jhi-indices-update',
  templateUrl: './indices-update.component.html',
})
export class IndicesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    description: [],
    mntSFTenf01: [],
    mntSFTenf02: [],
    soldeIndiciaire: [],
  });

  constructor(protected indicesService: IndicesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ indices }) => {
      this.updateForm(indices);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const indices = this.createFromForm();
    if (indices.id !== undefined) {
      this.subscribeToSaveResponse(this.indicesService.update(indices));
    } else {
      this.subscribeToSaveResponse(this.indicesService.create(indices));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIndices>>): void {
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

  protected updateForm(indices: IIndices): void {
    this.editForm.patchValue({
      id: indices.id,
      code: indices.code,
      description: indices.description,
      mntSFTenf01: indices.mntSFTenf01,
      mntSFTenf02: indices.mntSFTenf02,
      soldeIndiciaire: indices.soldeIndiciaire,
    });
  }

  protected createFromForm(): IIndices {
    return {
      ...new Indices(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      description: this.editForm.get(['description'])!.value,
      mntSFTenf01: this.editForm.get(['mntSFTenf01'])!.value,
      mntSFTenf02: this.editForm.get(['mntSFTenf02'])!.value,
      soldeIndiciaire: this.editForm.get(['soldeIndiciaire'])!.value,
    };
  }
}
