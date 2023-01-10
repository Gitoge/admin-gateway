import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITableTypeValeur } from '../table-type-valeur.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableTypeValeurService } from '../service/table-type-valeur.service';
import { TableTypeValeurDeleteDialogComponent } from '../delete/table-type-valeur-delete-dialog.component';

@Component({
  selector: 'jhi-table-type-valeur',
  templateUrl: './table-type-valeur.component.html',
})
export class TableTypeValeurComponent implements OnInit {
  tableTypeValeurs?: ITableTypeValeur[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected tableTypeValeurService: TableTypeValeurService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  loadAll(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.tableTypeValeurService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ITableTypeValeur[]>) => {
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
    this.tableTypeValeurs = [];
    this.loadAll();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: ITableTypeValeur): number {
    return item.id!;
  }

  delete(tableTypeValeur: ITableTypeValeur): void {
    const modalRef = this.modalService.open(TableTypeValeurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tableTypeValeur = tableTypeValeur;
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

  protected onSuccess(data: ITableTypeValeur[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/table-type-valeur'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.tableTypeValeurs = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
