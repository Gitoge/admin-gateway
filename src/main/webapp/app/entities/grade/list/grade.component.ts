import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrade } from '../grade.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { GradeService } from '../service/grade.service';
import { GradeDeleteDialogComponent } from '../delete/grade-delete-dialog.component';
import { PostesGradeDialogComponent } from '../postes_grade/roles_page-dialog.component';
import { PostesService } from '../../postes/service/postes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-grade',
  templateUrl: './grade.component.html',
})
export class GradeComponent implements OnInit {
  grades?: IGrade[];
  motCle?: string;
  displayStyle = 'none';
  codeForcage!: string;
  grade!: IGrade;
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
    protected gradeService: GradeService,
    protected activatedRoute: ActivatedRoute,
    protected postesService: PostesService,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if (this.motCle === undefined) {
      this.gradeService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IGrade[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.gradeService
        .recherche(this.motCle, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IGrade[]>) => {
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
    this.motCle = '';
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(grade: IGrade): void {
    this.grade = grade;
    this.displayStyle = 'block';
    this.size;
    this.backdrop = 'static';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.grade) {
        if (this.grade.id) {
          this.router.navigate([`${'grade'}/${this.grade.id}/${'edit'}`]);
        }
        this.displayStyle = 'none';
        this.size;
        this.backdrop = 'static';
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

  trackId(_index: number, item: IGrade): number {
    return item.id!;
  }
  recherche(): any {
    this.loadPage();
  }
  effacer(): any {
    this.motCle = '';
    this.loadPage();
  }
  delete(grade: IGrade): void {
    const modalRef = this.modalService.open(GradeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grade = grade;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  getPoste(grade: IGrade): void {
    const modalRef = this.modalService.open(PostesGradeDialogComponent, { size: 'lg', backdrop: 'static' });
    this.postesService.findByGrade(grade.id!).subscribe((resultGrade: any) => {
      modalRef.componentInstance.postes = resultGrade.body;
    });
    modalRef.componentInstance.grade = grade;
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
      //const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const sort = ['id'];
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });

    // console.error("handleNavigation", this.sort());
  }

  protected onSuccess(data: IGrade[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/grade'], {
        queryParams: {
          // page: this.page,
          // size: this.itemsPerPage,
          // sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.grades = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
