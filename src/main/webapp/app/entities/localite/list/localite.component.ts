import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocalite } from '../localite.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { LocaliteService } from '../service/localite.service';
import { LocaliteDeleteDialogComponent } from '../delete/localite-delete-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-localite',
  templateUrl: './localite.component.html',
  styleUrls: ['../localite.scss'],
})
export class LocaliteComponent implements OnInit {
  localites?: ILocalite[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  title = 'Liste des Localités';
  searchText: any;

  displayStyle = 'none';
  codeForcage!: string;
  localite!: ILocalite;

  motCles!: string;

  constructor(
    protected localiteService: LocaliteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.localiteService
      .findLocaliesByMotsCles(this.motCles, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ILocalite[]>) => {
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
    this.motCles = '';
    this.handleNavigation();
  }

  trackId(_index: number, item: ILocalite): number {
    return item.id!;
  }

  delete(localite: ILocalite): void {
    const modalRef = this.modalService.open(LocaliteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.localite = localite;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  recherche(): void {
    this.loadPage();
  }

  effacer(): void {
    this.motCles = '';
    this.loadPage();
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(localite: ILocalite): void {
    this.localite = localite;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      // this.codeForcage = "";
      if (this.localite) {
        if (this.localite.id) {
          this.router.navigate([`${'localite'}/${this.localite.id}/${'edit'}`]);
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
    const result = [this.predicate + ',' + (this.ascending ? DESC : ASC)];
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

  protected onSuccess(data: ILocalite[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/localite'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.localites = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
