import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPeriodePaye } from '../periode-paye.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PeriodePayeService } from '../service/periode-paye.service';
import { PeriodePayeDeleteDialogComponent } from '../delete/periode-paye-delete-dialog.component';
import { FormBuilder } from '@angular/forms';
import { ExerciceService } from '../../exercice/service/exercice.service';
import { map } from 'rxjs/operators';
import { IExercice } from '../../exercice/exercice.model';

@Component({
  selector: 'jhi-periode-paye',
  templateUrl: './periode-paye.component.html',
})
export class PeriodePayeComponent implements OnInit {
  periodePayes?: IPeriodePaye[];
  exercice: any;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  editForm = this.fb.group({
    exerciceId: [],
  });
  constructor(
    protected periodePayeService: PeriodePayeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected fb: FormBuilder,
    protected exerciceService: ExerciceService,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if (this.editForm.get('exerciceId')!.value?.id === undefined) {
      this.periodePayeService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IPeriodePaye[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.periodePayeService
        .queryByExercice(this.editForm.get('exerciceId')!.value?.id, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IPeriodePaye[]>) => {
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
    this.load();
  }
  effacer(): void {
    this.editForm.patchValue({
      exerciceId: '',
    });
    this.loadPage();
  }
  trackId(_index: number, item: IPeriodePaye): number {
    return item.id!;
  }
  findPeriodeByExercice(exerciceId: number): any {
    this.periodePayeService.findPeriodeByExercice(exerciceId).subscribe((result: any) => {
      this.periodePayes = result.body;
    });
  }

  delete(periodePaye: IPeriodePaye): void {
    const modalRef = this.modalService.open(PeriodePayeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.periodePaye = periodePaye;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }
  protected load(): any {
    this.exerciceService
      .query()
      .pipe(map((res: HttpResponse<IExercice[]>) => res.body ?? []))
      .pipe(
        map((exercice: IExercice[]) =>
          this.exerciceService.addExerciceToCollectionIfMissing(exercice, this.editForm.get('exerciceId')!.value)
        )
      )
      .subscribe((exercice: IExercice[]) => (this.exercice = exercice));
  }

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

  protected onSuccess(data: IPeriodePaye[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/periode-paye'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.periodePayes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
