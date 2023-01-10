import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPriseEnCompte } from '../prise-en-compte.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { PriseEnCompteService } from '../service/prise-en-compte.service';
import { PriseEnCompteDeleteDialogComponent } from '../delete/prise-en-compte-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConventionService } from 'app/entities/carriere/convention/service/convention.service';
import { IConvention } from 'app/entities/carriere/convention/convention.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-list-prise-en-compte',
  templateUrl: './list-prise-en-compte.component.html',
})
export class ListPriseEnCompteComponent implements OnInit {
  priseEnComptes: IPriseEnCompte[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  motCles!: string;
  displayStyle = 'none';
  convention!: IConvention;
  conventionId!: number | null | undefined;

  codeForcage!: string;

  priseEnCompte!: IPriseEnCompte;

  constructor(
    protected priseEnCompteService: PriseEnCompteService,
    protected modalService: NgbModal,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected conventionService: ConventionService
  ) {
    this.priseEnComptes = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.predicate = 'id';
    this.ascending = true;
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.priseEnCompteService
      .queryListePriseEnCompte({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPriseEnCompte[]>) => {
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
    this.priseEnComptes = [];
    this.handleNavigation();
  }

  ngOnInit(): void {
    this.motCles = '';
    this.handleNavigation();
  }
  openPopup(): void {
    this.displayStyle = 'block';
  }
  closePopup(): void {
    this.displayStyle = 'none';
  }

  trackId(_index: number, item: IPriseEnCompte): number {
    return item.id!;
  }

  delete(priseEnCompte: IPriseEnCompte): void {
    const modalRef = this.modalService.open(PriseEnCompteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.priseEnCompte = priseEnCompte;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup1(priseEnCompte: IPriseEnCompte): void {
    this.priseEnCompte = priseEnCompte;
    this.displayStyle = 'block';
  }

  closePopup1(): void {
    this.displayStyle = 'none';
  }

  validerPriseEnCompte(priseEnCompte: IPriseEnCompte): void {
    priseEnCompte.etat = 'VALIDEE';
    this.priseEnCompteService.update(priseEnCompte).subscribe((result: any) => {
      //
    });
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.priseEnCompte) {
        if (this.priseEnCompte.id) {
          this.router.navigate([`${'priseEnCompte'}/${this.priseEnCompte.id}/${'edit'}`]);
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

  protected onSuccess(data: IPriseEnCompte[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/prise-en-compte/list'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.priseEnComptes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
