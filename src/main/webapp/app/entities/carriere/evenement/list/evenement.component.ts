import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEvenement } from '../evenement.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { EvenementService } from '../service/evenement.service';
import { EvenementDeleteDialogComponent } from '../delete/evenement-delete-dialog.component';
import { IEmplois } from '../../../emplois/emplois.model';
import { PostesEmploisDialogComponent } from '../../../emplois/postes_emplois/roles_page-dialog.component';
import { ITypeActes } from '../../type-actes/type-actes.model';
import { ActeEvenementDialogComponent } from '../actes_evenement/roles_page-dialog.component';
import { TypeActesService } from '../../type-actes/service/type-actes.service';

@Component({
  selector: 'jhi-evenement',
  templateUrl: './evenement.component.html',
})
export class EvenementComponent implements OnInit {
  evenements?: IEvenement[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected evenementService: EvenementService,
    protected activatedRoute: ActivatedRoute,
    protected typeActesService: TypeActesService,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.evenementService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IEvenement[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: IEvenement): number {
    return item.id!;
  }
  getTypeActes(evenement: IEvenement): void {
    const modalRef = this.modalService.open(ActeEvenementDialogComponent, { size: 'lg', backdrop: 'static' });
    this.typeActesService.findByEvenement(evenement.id!).subscribe((resultEvent: any) => {
      modalRef.componentInstance.typeActes = resultEvent.body;
    });
    modalRef.componentInstance.evenement = evenement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  delete(evenement: IEvenement): void {
    const modalRef = this.modalService.open(EvenementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.evenement = evenement;
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

  protected onSuccess(data: IEvenement[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/evenement'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.evenements = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
