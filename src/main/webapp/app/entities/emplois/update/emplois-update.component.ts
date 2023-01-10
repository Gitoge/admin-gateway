import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { IEmplois, Emplois } from '../emplois.model';
import { EmploisService } from '../service/emplois.service';
import Swal from 'sweetalert2';
import { IPostes } from '../../postes/postes.model';
import { PostesService } from '../../postes/service/postes.service';
import { ASC, DESC, ITEMS_PER_PAGE } from '../../../config/pagination.constants';

@Component({
  selector: 'jhi-emplois-update',
  templateUrl: './emplois-update.component.html',
})
export class EmploisUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  titre!: string;
  postesSharedCollection: IPostes[] = [];
  postesChoisis: IPostes[] = [];

  emplois!: IEmplois;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  allItemsSelected = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    libelle: [null, [Validators.required]],
    description: [],
    tauxAt: [],
    primeLieEmploi: [],
    indemniteLogement: [],
    indemnitesujetion: [],
    indemnitehabillement: [],
    postes: [],
  });

  constructor(
    protected emploisService: EmploisService,
    protected activatedRoute: ActivatedRoute,
    protected postesService: PostesService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emplois }) => {
      this.updateForm(emplois);
      if (emplois.id !== undefined && emplois.id !== null) {
        this.titre = 'Modifier cet Emploi';

        this.postesService.findByEmplois(emplois.id!).subscribe((resultEmplois: any) => {
          console.error('dddd', resultEmplois.body);
          for (const postes of resultEmplois.body) {
            if (resultEmplois.body) {
              for (const postesEnregistre of resultEmplois.body) {
                if (postesEnregistre.id === postes.id) {
                  postes.isChecked = true;
                  this.postesChoisis.push(postesEnregistre);
                }
              }
            }
          }
        });
      } else {
        this.titre = 'Ajouter un Emploi';
      }
    });
    this.handleNavigation();
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
    const emplois = this.createFromForm();
    emplois.postes = this.postesChoisis;

    if (emplois.id !== undefined) {
      this.subscribeToSaveResponse(this.emploisService.update(emplois));
    } else {
      this.subscribeToSaveResponse(this.emploisService.create(emplois));
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
    this.postesService.findByEmplois(this.emplois.id!).subscribe((resultEmplois: any) => {
      for (const postes of resultEmplois.body) {
        if (this.emplois.postes) {
          for (const postesEnregistre of this.emplois.postes) {
            if (postesEnregistre.id === postes.id) {
              postes.isChecked = true;
              this.postesChoisis.push(postesEnregistre);
            }
          }
        }
      }
    });

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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmplois>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: error => this.onSaveError(error),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(err: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur...',
      text: err.error.message,
    });
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(emplois: IEmplois): void {
    this.editForm.patchValue({
      id: emplois.id,
      code: emplois.code,
      libelle: emplois.libelle,
      description: emplois.description,
      tauxAt: emplois.tauxAt,
      primeLieEmploi: emplois.primeLieEmploi,
      //postes: emplois.postes,
    });
  }
  protected createFromForm(): IEmplois {
    return {
      ...new Emplois(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      tauxAt: this.editForm.get(['tauxAt'])!.value,
      primeLieEmploi: this.editForm.get(['primeLieEmploi'])!.value,
      // postes: this.editForm.get(['postes'])!.value,
    };
  }
}
