import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGrade, Grade } from '../grade.model';
import { GradeService } from '../service/grade.service';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-grade-update',
  templateUrl: './grade-update.component.html',
})
export class GradeUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;
  isLoading = false;
  grades!: IGrade;

  postesSharedCollection: IPostes[] = [];
  postesChoisis: IPostes[] = [];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  allItemsSelected = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    description: [],
    ancEchClasse: [],
    nbreEchelon: [],
    postes: [],
  });

  constructor(
    protected gradeService: GradeService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grade }) => {
      this.updateForm(grade);

      if (grade.id !== undefined && grade.id !== null) {
        this.titre = 'Modifier Ce Grade';

        this.postesService.findByGrade(grade.id!).subscribe((resultGrade: any) => {
          for (const postes of resultGrade.body) {
            if (resultGrade.body) {
              for (const postesEnregistre of resultGrade.body) {
                if (postesEnregistre.id === postes.id) {
                  postes.isChecked = true;
                  this.postesChoisis.push(postesEnregistre);
                }
              }
            }
          }
        });
      } else {
        this.titre = 'Ajouter un Grade';
      }

      // this.loadRelationshipsOptions();
      this.handleNavigation();
    });
  }

  previousState(): void {
    window.history.back();
  }
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.postesService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPostes[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  save(): void {
    this.isSaving = true;
    // this.grades.postes = this.postesChoisis;
    const grade = this.createFromForm();
    grade.postes = this.postesChoisis;
    if (grade.id !== undefined) {
      this.subscribeToSaveResponse(this.gradeService.update(grade));
    } else {
      this.subscribeToSaveResponse(this.gradeService.create(grade));
    }
  }

  trackPostesById(_index: number, item: IPostes): number {
    return item.id!;
  }

  getSelectedPostes(option: IPostes, selectedVals?: IPostes[]): IPostes {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  add(event: any, postesChoisis: IPostes): void {
    if (event.target.checked === true) {
      postesChoisis.isChecked = true;
      this.postesChoisis.push(postesChoisis);
    } else {
      for (let i = 0; i < this.postesChoisis.length; i++) {
        if (this.postesChoisis[i].id === postesChoisis.id) {
          postesChoisis.isChecked = false;
          this.postesChoisis.splice(i, 1);
          break;
        }
      }
    }
    //    console.error("ADD Postes choisis listes :", this.postesChoisis);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrade>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const predicate = 'id';
      const ascending = true;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }
  protected onSuccess(data: IPostes[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;

    this.postesSharedCollection = data ?? [];
    for (const postes of this.postesSharedCollection) {
      for (const postesChoisi of this.postesChoisis) {
        if (postesChoisi.id === postes.id) {
          postes.isChecked = true;
        }
      }
    }

    // Pour le update
    for (const postes of this.postesSharedCollection) {
      if (this.grades.postes) {
        for (const postesEnregistre of this.grades.postes) {
          if (postesEnregistre.id === postes.id) {
            postes.isChecked = true;
            this.postesChoisis.push(postesEnregistre);
          }
        }
      }
    }
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
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

  protected updateForm(grade: IGrade): void {
    this.editForm.patchValue({
      id: grade.id,
      code: grade.code,
      libelle: grade.libelle,
      description: grade.description,
      ancEchClasse: grade.ancEchClasse,
      nbreEchelon: grade.nbreEchelon,
      // postes: grade.postes,
    });
    //this.postesSharedCollection = this.postesService.addPostesToCollectionIfMissing(this.postesSharedCollection, ...(grade.postes ?? []));
  }

  protected createFromForm(): IGrade {
    return {
      ...new Grade(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      ancEchClasse: this.editForm.get(['ancEchClasse'])!.value,
      nbreEchelon: this.editForm.get(['nbreEchelon'])!.value,
      //  postes: this.editForm.get(['postes'])!.value,
    };
  }
}
