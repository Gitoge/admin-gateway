import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FichePaie, IFichePaie } from '../fiche-paie.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { FichePaieService } from '../service/fiche-paie.service';
import { FichePaieDeleteDialogComponent } from '../delete/fiche-paie-delete-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AgentService } from '../../../carriere/agent/service/agent.service';
import { SituationAdministrativeService } from '../../../carriere/situation-administrative/service/situation-administrative.service';
import { EmploisService } from '../../../emplois/service/emplois.service';
import { EtablissementService } from '../../../etablissement/service/etablissement.service';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IExercice } from '../../exercice/exercice.model';
import { map } from 'rxjs/operators';
import { ExerciceService } from '../../exercice/service/exercice.service';
import { PeriodePayeService } from '../../periode-paye/service/periode-paye.service';
import { IPeriodePaye } from '../../periode-paye/periode-paye.model';
import Swal from 'sweetalert2';
import { EchelonService } from '../../../echelon/service/echelon.service';
import { SituationFamilialeService } from '../../../carriere/situation-familiale/service/situation-familiale.service';
import { HierarchieService } from '../../../hierarchie/service/hierarchie.service';
import { ServiceService } from '../../../service/service/service.service';
import { GradeService } from '../../../grade/service/grade.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'jhi-fiche-paie',
  templateUrl: './fiche-paie.component.html',
})
export class FichePaieComponent implements OnInit {
  fichePaies?: IFichePaie[];
  exercice?: IExercice[];
  periodePaye?: IPeriodePaye[];
  fiche: any;
  hierarchie: any;
  matricule: any;
  services: any;
  agent?: any;
  libelleEmplois: any;
  libelleEtablissement: any;
  grade: any;
  echelon: any;
  agentId: any;
  sitAdmin: any;
  sitFamiliale: any;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  documentDefinition: any;

  editForm = this.fb.group({
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    agentId: [],
    exerciceId: [],
    periodeId: [],
  });
  @ViewChild('testPDF', { static: false }) testPDF!: ElementRef;

  constructor(
    protected fichePaieService: FichePaieService,
    protected activatedRoute: ActivatedRoute,
    protected situationAdministrativeService: SituationAdministrativeService,
    protected situationFamilialeService: SituationFamilialeService,
    protected hierarchieService: HierarchieService,
    protected echelonService: EchelonService,
    protected emploisService: EmploisService,
    protected exerciceService: ExerciceService,
    protected periodePayeService: PeriodePayeService,
    protected etablissementService: EtablissementService,
    protected gradeService: GradeService,
    protected servicesService: ServiceService,
    protected agentService: AgentService,
    protected router: Router,
    protected modalService: NgbModal,
    protected fb: FormBuilder
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.fichePaieService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IFichePaie[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  refresh(): void {
    //  window.location.reload();
    this.agent = [];
    this.fiche = [];
    this.router.navigate(['/fiche-paie']);
  }

  // pour l'impression des bulletins de solde

  public downloadPdf(): void {
    const pdfTable = this.testPDF.nativeElement;
    const html = htmlToPdfmake(pdfTable.innerHTML.fontsize(1));
    this.documentDefinition = {
      content: pdfTable.innerHTML.fontsize(1),
    };
    const c = pdfMake.createPdf(this.documentDefinition);
    c.open();
  }

  public openPDF(): void {
    const DATA: any = document.getElementById('testPDF');
    html2canvas(DATA).then(canvas => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/jpg');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('bulletin-salaire.pdf');
    });
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.load();
  }

  trackId(_index: number, item: IFichePaie): number {
    return item.id!;
  }

  delete(fichePaie: IFichePaie): void {
    const modalRef = this.modalService.open(FichePaieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fichePaie = fichePaie;
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
    });
  }

  getAgentByMatricule(matricule: any): void {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      this.agent = result.body[0];
      console.error('Agent', this.agent);
      this.agentId = this.agent.id;

      this.fichePaieService
        .findFicheByAgent(this.agent.id, this.editForm.get('exerciceId')!.value?.id, this.editForm.get('periodeId')!.value?.id)
        .subscribe((resultFiche: any) => {
          this.fiche = resultFiche.body;

          if (this.fiche === undefined || this.fiche.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur...',
              text: 'fiche paie  introuvable !',
            });
          }
        });

      // infos Situation familiale
      this.situationFamilialeService.findByAgent(this.agent.id).subscribe((resultSitFamille: any) => {
        console.error('Sit familiale ', resultSitFamille.body);
        this.sitFamiliale = resultSitFamille.body;
      });

      // Infos Situation administrative
      this.situationAdministrativeService.findByAgent(this.agentId).subscribe((resultSit: any) => {
        console.error('sit Admin', resultSit.body);
        this.sitAdmin = resultSit.body;

        // Information Hierarchie
        if (resultSit.body.hierarchieId !== null) {
          this.hierarchieService.find(resultSit.body.hierarchieId).subscribe((resultHier: any) => {
            console.error('Hierarchie', resultHier.body);
            this.hierarchie = resultHier.body;
          });
        } else {
          this.hierarchie = [];
        }

        // Information Service
        this.servicesService.find(resultSit.body.servicesId).subscribe((resultService: any) => {
          console.error('Service', resultService.body);
          this.services = resultService.body;
        });

        // Information Grade
        this.gradeService.find(resultSit.body.gradeId).subscribe((resultGrade: any) => {
          console.error('Grade', resultGrade.body);
          this.grade = resultGrade.body;
        });

        // Information echelon
        if (resultSit.body.echelonId !== null) {
          this.echelonService.getEchelonById(resultSit.body.echelonId).subscribe((resultEhelon: any) => {
            console.error('echelon ', resultEhelon.body);
            this.echelon = resultEhelon.body;
          });
        } else {
          this.echelon = [];
        }

        // infos emplois
        this.emploisService.findByCode(resultSit.body.codeEmplois).subscribe((resultEmplois: any) => {
          console.error('emplois ', resultEmplois.body.libelle);
          this.libelleEmplois = resultEmplois.body.libelle;
        });

        // infos etablissement
        this.etablissementService.findEtablissementById(resultSit.body.etablissement).subscribe((resultEtab: any) => {
          console.error('emplois ', resultEtab.body.libelle);
          this.libelleEtablissement = resultEtab.body.libelleLong;
        });
      });
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

  protected onSuccess(data: IFichePaie[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/fiche-paie'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.fichePaies = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  protected createFromForm(): IFichePaie {
    return {
      ...new FichePaie(),
      matricule: this.editForm.get(['matricule'])!.value,
    };
  }
}
