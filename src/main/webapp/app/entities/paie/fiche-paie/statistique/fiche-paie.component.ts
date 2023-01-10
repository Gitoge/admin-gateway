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
import ApexCharts from 'apexcharts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'jhi-fiche-paie',
  templateUrl: './fiche-paie.component.html',
})
export class StatistiqueComponent implements OnInit {
  fichePaies?: IFichePaie[];
  exercice?: IExercice[];
  periodePaye?: IPeriodePaye[];
  fiche: any;
  nombrePoste?: any;
  hierarchie: any;
  libelleEmplois: any;
  libelleEtablissement: any;
  echelon: any;
  agentId: any;
  sitAdmin: any;
  sitFamiliale: any;
  grade: any;
  services: any;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  documentDefinition: any;

  editForm = this.fb.group({
    exerciceId: [],
    periodeId: [],
  });
  @ViewChild('testPDF', { static: false }) testPDF!: ElementRef;

  constructor(
    protected fichePaieService: FichePaieService,
    protected activatedRoute: ActivatedRoute,
    protected situationAdministrativeService: SituationAdministrativeService,
    protected situationFamilialeService: SituationFamilialeService,
    protected echelonService: EchelonService,
    protected emploisService: EmploisService,
    protected hierarchieService: HierarchieService,
    protected gradeService: GradeService,
    protected servicesService: ServiceService,
    protected exerciceService: ExerciceService,
    protected periodePayeService: PeriodePayeService,
    protected etablissementService: EtablissementService,
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
      PDF.save('statistique.pdf');
    });
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.load();
  }
  refresh(): void {
    window.location.reload();
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

  getStatistiqueByPeriode(periodeId: any): void {
    this.fichePaieService.sommePoste(periodeId).subscribe((resultFiche: any) => {
      this.fiche = resultFiche.body;

      console.error('aa', resultFiche.body);
      if (this.fiche === undefined || this.fiche.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'fiche paie  introuvable !',
        });
      }
    });
    this.fichePaieService.counEtablissementPoste(periodeId).subscribe((result: any) => {
      this.nombrePoste = result.body;

      for (let i = 0; i <= result.body.length; i++) {
        // infos etablissement
        this.etablissementService.findEtablissementById(result.body[i][0]).subscribe((resultEtab: any) => {
          this.libelleEtablissement = resultEtab.body;
          console.error('dddddd', this.libelleEtablissement);
        });
      }

      if (this.nombrePoste === undefined || this.nombrePoste.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'fiche paie  introuvable !',
        });
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
}
