import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrilleIndiciaire } from '../grille-indiciaire.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { GrilleIndiciaireService } from '../service/grille-indiciaire.service';
import { GrilleIndiciaireDeleteDialogComponent } from '../delete/grille-indiciaire-delete-dialog.component';
import { HierarchieService } from 'app/entities/hierarchie/service/hierarchie.service';
import { IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { IEchelon } from 'app/entities/echelon/echelon.model';
import { EchelonService } from 'app/entities/echelon/service/echelon.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';

@Component({
  selector: 'jhi-grille-indiciaire',
  templateUrl: './grille-indiciaire.component.html',
})
export class GrilleIndiciaireComponent implements OnInit {
  grilleIndiciaires?: IGrilleIndiciaire[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  motCles!: string;

  hierarchie!: IHierarchie;

  echelon!: IEchelon;

  grade!: IGrade;

  hierarchieId?: number | null;

  echelonId?: number | null;

  gradeId?: number | null;

  constructor(
    protected grilleIndiciaireService: GrilleIndiciaireService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected hierarchieService: HierarchieService,
    protected echelonService: EchelonService,
    protected gradeService: GradeService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.grilleIndiciaireService
      .findGIndicesByMotsCles(this.motCles, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IGrilleIndiciaire[]>) => {
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

  trackId(_index: number, item: IGrilleIndiciaire): number {
    return item.id!;
  }

  recherche(): void {
    this.loadPage();
  }
  effacer(): void {
    this.motCles = '';
    this.loadPage();
  }

  delete(grilleIndiciaire: IGrilleIndiciaire): void {
    const modalRef = this.modalService.open(GrilleIndiciaireDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grilleIndiciaire = grilleIndiciaire;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  findLibelleHierarchie(grilleIndiciaire: IGrilleIndiciaire[]): void {
    for (let i = 0; i < grilleIndiciaire.length; i++) {
      this.hierarchieId = grilleIndiciaire[i].hierarchieId;
      if (this.hierarchieId) {
        this.hierarchieService.findLibelle(this.hierarchieId).subscribe((result: any) => {
          this.hierarchie = result.body;
          grilleIndiciaire[i].libelleHierarchie = this.hierarchie.libelle;
        });
      }
    }
  }

  findLibelleEchelon(grilleIndiciaire: IGrilleIndiciaire[]): void {
    for (let i = 0; i < grilleIndiciaire.length; i++) {
      this.echelonId = grilleIndiciaire[i].echelonId;
      if (this.echelonId) {
        this.echelonService.find(this.echelonId).subscribe((result: any) => {
          this.echelon = result.body;
          grilleIndiciaire[i].libelleEchelon = this.echelon.libelle;
        });
      }
    }
  }

  findCodeGrade(grilleIndiciaire: IGrilleIndiciaire[]): void {
    for (let i = 0; i < grilleIndiciaire.length; i++) {
      this.gradeId = grilleIndiciaire[i].gradeId;
      if (this.gradeId) {
        this.gradeService.find(this.gradeId).subscribe((result: any) => {
          this.grade = result.body;
          grilleIndiciaire[i].codeGrade = this.grade.code;
        });
      }
    }
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

  protected onSuccess(data: IGrilleIndiciaire[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/grille-indiciaire'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.grilleIndiciaires = data ?? [];
    this.ngbPaginationPage = this.page;
    if (this.grilleIndiciaires) {
      this.findLibelleHierarchie(this.grilleIndiciaires);
      this.findLibelleEchelon(this.grilleIndiciaires);
      this.findCodeGrade(this.grilleIndiciaires);
    }
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
