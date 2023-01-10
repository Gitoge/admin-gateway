import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEvenement, Evenement } from '../evenement.model';
import { EvenementService } from '../service/evenement.service';
import { ITypeActes } from '../../type-actes/type-actes.model';
import { TypeActesService } from '../../type-actes/service/type-actes.service';
import { ASC, DESC, ITEMS_PER_PAGE } from '../../../../config/pagination.constants';
import { IPostes } from '../../../postes/postes.model';

@Component({
  selector: 'jhi-evenement-update',
  templateUrl: './evenement-update.component.html',
})
export class EvenementUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  entete = '';
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  allItemsSelected = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
    libelle: [],
    description: [],
    typeActes: [],
  });

  typeActesSharedCollection: ITypeActes[] = [];
  typeActeChoisis: ITypeActes[] = [];
  evenement!: IEvenement;

  constructor(
    protected evenementService: EvenementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected typeActesService: TypeActesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ evenement }) => {
      this.updateForm(evenement);
      if (evenement.id !== undefined) {
        this.entete = 'Modifier Evenement';

        this.typeActesService.findByEvenement(evenement.id!).subscribe((resultTypeActe: any) => {
          for (const typeActe of resultTypeActe.body) {
            if (resultTypeActe.body) {
              for (const typeActeEnregistre of resultTypeActe.body) {
                if (typeActeEnregistre.id === typeActe.id) {
                  typeActe.isChecked = true;
                  this.typeActeChoisis.push(typeActeEnregistre);
                }
              }
            }
          }
        });
      } else {
        this.entete = 'Ajouter Evenement';
      }
    });

    this.typeActesService
      .query()
      .pipe(map((res: HttpResponse<ITypeActes[]>) => res.body ?? []))
      .pipe(
        map((typeActes: ITypeActes[]) =>
          this.typeActesService.addTypeActesToCollectionIfMissing(typeActes, ...(this.editForm.get('typeActes')!.value ?? []))
        )
      )
      .subscribe((typeActes: ITypeActes[]) => (this.typeActesSharedCollection = typeActes));

    this.handleNavigation();
  }

  getSelectedTypeActes(option: ITypeActes, selectedVals?: ITypeActes[]): ITypeActes {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  previousState(): void {
    window.history.back();
  }
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.typeActesService
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
    const evenement = this.createFromForm();
    evenement.typeActes = this.typeActeChoisis;

    if (evenement.id !== undefined) {
      this.subscribeToSaveResponse(this.evenementService.update(evenement));
    } else {
      this.subscribeToSaveResponse(this.evenementService.create(evenement));
    }
  }
  getSelectedtypeActe(option: ITypeActes, selectedVals?: ITypeActes[]): ITypeActes {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }
  add(event: any, typeActeChoisis: IPostes): void {
    if (event.target.checked === true) {
      typeActeChoisis.isChecked = true;
      this.typeActeChoisis.push(typeActeChoisis);
    } else {
      for (let i = 0; i < this.typeActeChoisis.length; i++) {
        if (this.typeActeChoisis[i].id === typeActeChoisis.id) {
          typeActeChoisis.isChecked = false;
          this.typeActeChoisis.splice(i, 1);
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
  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvenement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  protected onSuccess(data: IPostes[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;

    this.typeActesSharedCollection = data ?? [];
    for (const typeActeChoisi of this.typeActesSharedCollection) {
      for (const typeActe of this.typeActeChoisis) {
        if (typeActeChoisi.id === typeActe.id) {
          typeActeChoisi.isChecked = true;
        }
      }
    }

    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
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

  protected updateForm(evenement: IEvenement): void {
    this.editForm.patchValue({
      id: evenement.id,
      code: evenement.code,
      libelle: evenement.libelle,
      description: evenement.description,
      typeActes: evenement.typeActes,
    });
  }

  protected createFromForm(): IEvenement {
    return {
      ...new Evenement(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      typeActes: this.editForm.get(['typeActes'])!.value,
    };
  }
}
