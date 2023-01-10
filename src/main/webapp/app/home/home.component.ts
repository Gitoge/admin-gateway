import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { finalize, takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { StateStorageService } from '../core/auth/state-storage.service';
import { PersonneService } from '../entities/personne/service/personne.service';
import { HttpResponse } from '@angular/common/http';
import { IPersonne } from '../entities/personne/personne.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangerPasswordComponent } from './change-password';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  modules: any;
  personne?: IPersonne;
  profils: any;
  pages_modules: any;
  userInfos: any;
  isSaving = false;
  modalRef?: NgbModalRef;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private stateStorageService: StateStorageService,
    private personneService: PersonneService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.personne = this.stateStorageService.getPersonne();
    this.modules = this.stateStorageService.getModulesOfProfil();
    this.profils = this.stateStorageService.getProfils();
    this.pages_modules = this.stateStorageService.getPagesAllModules();
    this.userInfos = this.stateStorageService.getDataUser();
    /* if (this.personne != null) {
      if (this.personne.jhiUserId === this.userInfos.id) {
        this.subscribeToSaveResponse(this.personneService.update(this.personne));
      }
    } */
    if (this.personne.id) {
      if (this.personne.datePremiereConnexion === null) {
        this.modalRef = this.modalService.open(ChangerPasswordComponent, {
          size: 'lg',
          backdrop: 'static',
        });
      }
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  previousState(): void {
    window.history.back();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonne>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    // this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
