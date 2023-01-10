import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrilleConvention } from '../grille-convention.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { GrilleConventionService } from '../service/grille-convention.service';
import { GrilleConventionDeleteDialogComponent } from '../delete/grille-convention-delete-dialog.component';

@Component({
  selector: 'jhi-grille-convention',
  templateUrl: './grille-convention.component.html',
})
export class GrilleConventionComponent implements OnInit {
  grilleConventions?: IGrilleConvention[];
  isLoading = false;
  libelleEtablissement!: string;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected grilleConventionService: GrilleConventionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    if (this.libelleEtablissement === '' || this.libelleEtablissement === undefined) {
      this.grilleConventionService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IGrilleConvention[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.grilleConventionService
        .findGrilleConventionByEtablissement(this.libelleEtablissement, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IGrilleConvention[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    }
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.libelleEtablissement = '';
  }
  recherche(): any {
    this.loadPage();
  }
  effacer(): void {
    this.libelleEtablissement = '';
    this.loadPage();
  }

  trackId(_index: number, item: IGrilleConvention): number {
    return item.id!;
  }

  delete(grilleConvention: IGrilleConvention): void {
    const modalRef = this.modalService.open(GrilleConventionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grilleConvention = grilleConvention;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
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
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IGrilleConvention[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/grille-convention'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.grilleConventions = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
