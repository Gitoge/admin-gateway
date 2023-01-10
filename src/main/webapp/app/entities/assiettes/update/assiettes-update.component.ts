import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';

import { IAssiettes, Assiettes } from '../assiettes.model';
import { AssiettesService } from '../service/assiettes.service';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-assiettes-update',
  templateUrl: './assiettes-update.component.html',
})
export class AssiettesUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  assiettes!: IAssiettes;

  postesSharedCollection: IPostes[] = [];

  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  postesChoisis: IPostes[] = [];

  allItemsSelected = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
    postes: [],
  });

  constructor(
    protected assiettesService: AssiettesService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assiettes }) => {
      this.assiettes = assiettes;

      if (assiettes.id !== undefined && assiettes.id !== null) {
        this.titre = 'Modifier cette Assiette';
      } else {
        this.titre = 'Ajouter une Assiette';
      }
      this.handleNavigation();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.assiettes.postes = this.postesChoisis;
    if (this.assiettes.id !== undefined) {
      this.subscribeToSaveResponse(this.assiettesService.update(this.assiettes));
    } else {
      this.subscribeToSaveResponse(this.assiettesService.create(this.assiettes));
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

  verifAssiettePostes(idPostes: number): boolean {
    if (typeof this.postesSharedCollection !== 'undefined' && this.postesSharedCollection !== null) {
      for (const postes of this.postesSharedCollection) {
        if (postes.id === idPostes) {
          return true;
        }
      }
    }
    return false;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssiettes>>): void {
    result.subscribe(
      (res: HttpResponse<IAssiettes>) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
    // Pour ne pas griser le bouton enregistrer
    this.isSaving = false;
  }

  protected onSaveSuccess(assiettes: IAssiettes | null): void {
    if (assiettes !== null) {
      this.assiettes = assiettes;

      this.isSaving = false;

      if (this.assiettes.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Exercice <b>${assiettes?.libelle ?? ''}</b> enregistré avec succès</h4>`
        );
      }

      this.previousState();
    }
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
      if (this.assiettes.postes) {
        for (const postesEnregistre of this.assiettes.postes) {
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

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
