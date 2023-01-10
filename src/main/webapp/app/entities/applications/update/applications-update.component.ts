import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IApplications, Applications } from '../applications.model';
import { ApplicationsService } from '../service/applications.service';

@Component({
  selector: 'jhi-applications-update',
  templateUrl: './applications-update.component.html',
})
export class ApplicationsUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;
  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    nom: [],
    description: [],
  });

  constructor(protected applicationsService: ApplicationsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applications }) => {
      this.updateForm(applications);
      if (applications.id !== undefined && applications.id !== null) {
        this.titre = 'Modifier le nom de cette application: ';
        //this.titre = 'Modifier le nom de cette application: ' [applications.nom];
      } else {
        this.titre = 'Ajouter une Application';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applications = this.createFromForm();
    if (applications.id !== undefined) {
      this.subscribeToSaveResponse(this.applicationsService.updateApp(applications));
    } else {
      this.subscribeToSaveResponse(this.applicationsService.create(applications));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplications>>): void {
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

  protected updateForm(applications: IApplications): void {
    this.editForm.patchValue({
      id: applications.id,
      code: applications.code,
      nom: applications.nom,
      description: applications.description,
    });
  }

  protected createFromForm(): IApplications {
    return {
      ...new Applications(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
