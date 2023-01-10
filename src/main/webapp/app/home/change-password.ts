import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, finalize, Observable, Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PasswordService } from 'app/account/password/password.service';
import { LoginService } from 'app/login/login.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { PersonneService } from 'app/entities/personne/service/personne.service';
import { IPersonne } from 'app/entities/personne/personne.model';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'jhi-password',
  templateUrl: './change-password.html',
})
export class ChangerPasswordComponent implements OnInit {
  doNotMatch = false;
  error = false;
  success = false;
  @Output() clickevent = new EventEmitter<string>();
  isNavbarCollapsed = true;

  typeMessage?: string;
  _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage = '';

  @ViewChild('staticAlert', { static: false }) staticAlert?: NgbAlert;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

  account$?: Observable<Account | null>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  constructor(
    private stateStorageService: StateStorageService,
    protected personneService: PersonneService,
    private passwordService: PasswordService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private router: Router,
    private loginService: LoginService
  ) {}

  public afficheMessage(msg: string, typeMessage?: string): void {
    this.typeMessage = typeMessage;
    this._success.next(msg);
  }

  initMessage(): void {
    this._success.subscribe(message => (this.successMessage = message));
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
    this.initMessage();
  }
  close(): void {
    this.clickevent.emit('closed');
    this.activeModal.dismiss('success');
  }
  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
  retour(): void {
    this.clickevent.emit('closed');
    this.activeModal.dismiss('success');
    this.logout();
  }
  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
        () => {
          this.subscribeToSaveResponse(this.personneService.updatePremiereConnexion(this.stateStorageService.getPersonne().id!));
          //}
        },
        (res: HttpErrorResponse) => {
          this.onErrorChangePassword(res.error.title);
        }
      );
    }
  }

  protected onErrorChangePassword(msgErreur: string): void {
    if (msgErreur) {
      if (msgErreur === 'Incorrect password') {
        this.afficheMessage('Vous devez donner votre mot de passe actuel.', 'danger');
      } else {
        this.afficheMessage(msgErreur, 'danger');
      }
    } else {
      this.afficheMessage('Erreur changement mot de passe.', 'danger');
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonne>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    this.success = false;
  }

  protected onSaveSuccess(): void {
    this.close();
    this.logout();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
