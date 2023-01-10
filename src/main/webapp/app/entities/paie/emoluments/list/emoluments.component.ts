import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

import { Emoluments, IEmoluments } from '../emoluments.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { EmolumentsService } from '../service/emoluments.service';
import { EmolumentsDeleteDialogComponent } from '../delete/emoluments-delete-dialog.component';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { SituationAdministrativeService } from '../../../carriere/situation-administrative/service/situation-administrative.service';
import { PosteCompoGradeService } from '../../poste-compo-grade.service';
import { AugmentationIndiceService } from '../../augmentation-indice/service/augmentation-indice.service';
import { finalize, map } from 'rxjs/operators';
import { ExclusionTauxService } from '../../exclusion-taux/service/exclusion-taux.service';
import { StateStorageService } from '../../../../core/auth/state-storage.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { PeriodePayeService } from '../../periode-paye/service/periode-paye.service';
import { IPeriodePaye } from '../../periode-paye/periode-paye.model';

@Component({
  selector: 'jhi-emoluments',
  templateUrl: './emoluments.component.html',
})
export class EmolumentsComponent implements OnInit {
  emoluments?: IEmoluments[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  agents?: IAgent[];
  isSaving = false;
  maxTaux: any;
  generationSucced!: boolean;

  keyword = 'libelleLong';

  periodePayeEnCours!: IPeriodePaye;

  etatPeriodePayeEnCours!: string;

  etablissementSharedCollection: IEtablissement[] = [];
  agentIds!: number[];

  editForm = this.fb.group({
    id: [],
    matricule: [],
    etablissementId: [],
  });
  etablissementId!: number;

  constructor(
    protected emolumentsService: EmolumentsService,
    protected situationAdministrativeService: SituationAdministrativeService,
    protected posteCompoGradeService: PosteCompoGradeService,
    protected augmentationIndiceService: AugmentationIndiceService,
    protected stateStorageService: StateStorageService,
    protected exclusionTauxservice: ExclusionTauxService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected agentService: AgentService,
    protected fb: FormBuilder,
    protected etablissementService: EtablissementService,
    protected periodePayeService: PeriodePayeService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.emolumentsService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IEmoluments[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });

    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissementId')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));
  }

  ngOnInit(): void {
    this.etatPeriodePayeEnCours = '';
    this.periodePayeService.findPeriodeEnCours().subscribe((res: any) => {
      this.periodePayeEnCours = res.body;
      if (this.periodePayeEnCours.statut) {
        this.etatPeriodePayeEnCours = this.periodePayeEnCours.statut;
      }
    });
    this.handleNavigation();
  }

  trackId(_index: number, item: IEmoluments): number {
    return item.id!;
  }

  delete(emoluments: IEmoluments): void {
    const modalRef = this.modalService.open(EmolumentsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emoluments = emoluments;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  selectEventEtablissement(item: any): any {
    if (item) {
      this.agentService.findByEtablissement(item.id).subscribe((result: any) => {
        this.agentIds = result.body;
        console.error(this.agentIds);
      });
    }
  }

  onChangeSearch(search: any): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any): any {
    // do something
  }

  getSelectedEtablissement(etablissementId: number | null | undefined): void {
    if (etablissementId !== null && etablissementId !== undefined) {
      this.etablissementId = etablissementId;
    }
  }

  getAgentByMatricule(matricule: any): void {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      this.agents = result.body;

      if (this.agents) {
        if (this.agents.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: 'Matricule introuvable !',
          });
        } else {
          if (this.agents[0].id) {
            this.emolumentsService.genererEmolumentByGrade(this.agents[0].id).subscribe((resultat: any) => {
              if (resultat.body.length > 0) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success...',
                  text: 'Génération terminée avec Succès !',
                });
              }
            });

            this.emolumentsService.genererEmolumentByEmplois(this.agents[0].id).subscribe((resultatEmplois: any) => {
              if (resultatEmplois.body.length > 0) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success...',
                  text: 'Génération terminée avec Succès !',
                });
              }
            });
          }
        }
      }
    });
  }

  genereEmolentsAllAgentByEtablissement(agentIds: number[]): void {
    for (let i = 0; i < agentIds.length; i++) {
      this.agentService.genererEmolument(agentIds[i]).subscribe((rs: any) => {
        if (rs.body.length > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Génération terminée avec Succès !',
          });
        }
      });
    }
  }

  genereEmolentsForAllAgent(): void {
    this.agentService.genererEmolumentForAll().subscribe((rs: any) => {
      if (rs.body.length === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Success...',
          text: 'Génération terminée avec Succès !',
        });
      }
    });
  }

  protected onSaveSuccess1(): void {
    this.router.navigate(['/emoluments']);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected subscribeToSaveResponse2(result: Observable<HttpResponse<IEmoluments>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess1(),
      error: () => this.onSaveError(),
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

  protected onSuccess(data: IEmoluments[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/emoluments'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.emoluments = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
