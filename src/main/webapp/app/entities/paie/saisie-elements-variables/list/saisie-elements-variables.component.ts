import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ISaisieElementsVariables } from '../saisie-elements-variables.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { SaisieElementsVariablesService } from '../service/saisie-elements-variables.service';
import { SaisieElementsVariablesDeleteDialogComponent } from '../delete/saisie-elements-variables-delete-dialog.component';
import { PeriodePayeService } from '../../periode-paye/service/periode-paye.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IExercice } from '../../exercice/exercice.model';
import { IPeriodePaye } from '../../periode-paye/periode-paye.model';
import { ExerciceService } from '../../exercice/service/exercice.service';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-saisie-elements-variables',
  templateUrl: './saisie-elements-variables.component.html',
})
export class SaisieElementsVariablesComponent implements OnInit {
  saisieElementsVariables?: ISaisieElementsVariables[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  today: any;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  motCles!: string;
  exercice?: IExercice[];
  periodePaye?: IPeriodePaye[];
  editForm = this.fb.group({
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    exerciceId: [],
    periodeId: [],
  });

  constructor(
    protected saisieElementsVariablesService: SaisieElementsVariablesService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected fb: FormBuilder,
    protected periodePayeService: PeriodePayeService,
    protected exerciceService: ExerciceService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    if (this.editForm.get('periodeId')!.value?.id !== null || this.editForm.get('periodeId')!.value?.id !== undefined) {
      this.saisieElementsVariablesService
        .query(this.editForm.get('matricule')!.value?.id, this.editForm.get('periodeId')!.value?.id, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<ISaisieElementsVariables[]>) => {
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
    // this.handleNavigation();
    // this.motCles='';
    this.today = dayjs().startOf('day');

    this.load();
    // this.loadPage();
  }

  trackId(_index: number, item: ISaisieElementsVariables): number {
    return item.id!;
  }
  recherche(): any {
    this.loadPage();
  }
  effacer(): any {
    this.motCles = '';
    this.loadPage();
  }
  delete(saisieElementsVariables: ISaisieElementsVariables): void {
    const modalRef = this.modalService.open(SaisieElementsVariablesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.saisieElementsVariables = saisieElementsVariables;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }
  findPeriodeByExercice(exerciceId: number): any {
    this.periodePayeService.findPeriodeByExercice(exerciceId).subscribe((result: any) => {
      this.periodePaye = result.body;
      console.error('dddddddd', result.body);
    });
  }
  getSAIByMatricule(): void {
    this.saisieElementsVariablesService
      .query(this.editForm.get('matricule')!.value, this.editForm.get('periodeId')!.value?.id)
      .subscribe((resultFiche: any) => {
        this.saisieElementsVariables = resultFiche.body;
        console.error('jjjjjj', resultFiche.body);
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

  protected onSuccess(data: ISaisieElementsVariables[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/saisie-elements-variables/list'], {
        queryParams: {
          // page: this.page,
          //   size: this.itemsPerPage,
          //  sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.saisieElementsVariables = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
