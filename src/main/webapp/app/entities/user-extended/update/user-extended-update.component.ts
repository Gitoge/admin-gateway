import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUserExtended, UserExtended } from '../user-extended.model';
import { UserExtendedService } from '../service/user-extended.service';

@Component({
  selector: 'jhi-user-extended-update',
  templateUrl: './user-extended-update.component.html',
})
export class UserExtendedUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected userExtendedService: UserExtendedService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtended }) => {
      this.updateForm(userExtended);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userExtended = this.createFromForm();
    if (userExtended.id !== undefined) {
      this.subscribeToSaveResponse(this.userExtendedService.update(userExtended));
    } else {
      this.subscribeToSaveResponse(this.userExtendedService.create(userExtended));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserExtended>>): void {
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

  protected updateForm(userExtended: IUserExtended): void {
    this.editForm.patchValue({
      id: userExtended.id,
    });
  }

  protected createFromForm(): IUserExtended {
    return {
      ...new UserExtended(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
