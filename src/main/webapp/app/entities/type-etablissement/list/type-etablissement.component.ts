import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeEtablissement } from '../type-etablissement.model';

import { ASC, DESC, ITEMS_PER_PAGE, CODE_FORCAGE } from 'app/config/pagination.constants';
import { TypeEtablissementService } from '../service/type-etablissement.service';
import { TypeEtablissementDeleteDialogComponent } from '../delete/type-etablissement-delete-dialog.component';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-type-etablissement',
  templateUrl: './type-etablissement.component.html',
})
export class TypeEtablissementComponent implements OnInit {
  typeEtablissements?: ITypeEtablissement[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  motCles!: string;

  displayStyle = 'none';

  codeForcage!: string;

  typeEtablissement!: ITypeEtablissement;

  constructor(
    protected typeEtablissementService: TypeEtablissementService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.typeEtablissements = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.typeEtablissementService
      .findTypeEtablissementByMotsCles(this.motCles, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ITypeEtablissement[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.typeEtablissements = [];
    this.loadAll();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.motCles = '';
    this.handleNavigation();
  }

  recherche(): void {
    this.loadPage();
  }

  effacer(): void {
    this.motCles = '';
    this.loadPage();
  }

  trackId(_index: number, item: ITypeEtablissement): number {
    return item.id!;
  }

  delete(typeEtablissement: ITypeEtablissement): void {
    const modalRef = this.modalService.open(TypeEtablissementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeEtablissement = typeEtablissement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */
  openPopup(typeEtablissement: ITypeEtablissement): void {
    this.typeEtablissement = typeEtablissement;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      // this.codeForcage = "";
      if (this.typeEtablissement) {
        if (this.typeEtablissement.id) {
          this.router.navigate([`${'type-etablissement'}/${this.typeEtablissement.id}/${'edit'}`]);
        }
        this.displayStyle = 'none';
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Code de forçage incorrect !',
      });
    }
    this.codeForcage = '';
  }

  /** FIN IMPLEMENTATION DU CODE DE FORCAGE */

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      // const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const sort = ['id'];
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: ITypeEtablissement[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/type-etablissement'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.typeEtablissements = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
