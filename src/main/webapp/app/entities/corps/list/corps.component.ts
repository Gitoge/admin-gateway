import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICorps } from '../corps.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CorpsService } from '../service/corps.service';
import { CorpsDeleteDialogComponent } from '../delete/corps-delete-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IGrade } from '../../grade/grade.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-corps',
  templateUrl: './corps.component.html',
})
export class CorpsComponent implements OnInit {
  corps: ICorps[];
  displayStyle = 'none';
  codeForcage!: string;
  corp!: ICorps;
  size = 'lg';
  backdrop = '';

  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected corpsService: CorpsService,
    protected modalService: NgbModal,
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
    this.corps = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.predicate = 'id';
    this.ascending = true;
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.corpsService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ICorps[]>) => {
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
    this.corps = [];
    this.loadPage();
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(corps: ICorps): void {
    this.corp = corps;
    this.displayStyle = 'block';
    this.size;
    this.backdrop = 'static';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.corp) {
        if (this.corp.id) {
          this.router.navigate([`${'corps'}/${this.corp.id}/${'edit'}`]);
        }
        this.displayStyle = 'none';
        this.size;
        this.backdrop = 'static';
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Code de for??age incorrect !',
      });
    }
    this.codeForcage = '';
  }

  trackId(_index: number, item: ICorps): number {
    return item.id!;
  }

  delete(corps: ICorps): void {
    const modalRef = this.modalService.open(CorpsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.corps = corps;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
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

  protected onSuccess(data: ICorps[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/corps'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.corps = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
