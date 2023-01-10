import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { PersonneService } from '../entities/personne/service/personne.service';
import { PasswordComponent } from '../account/password/password.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;
  personne?: any;
  modalRef?: NgbModalRef;
  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private stateStorageService: StateStorageService,
    private personneService: PersonneService,
    private router: Router,
    private fb: FormBuilder,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    //after logout : remove localstorage
    localStorage.clear();

    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();
  }

  login(): void {
    this.loginService
      .login({
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value,
        rememberMe: this.loginForm.get('rememberMe')!.value,
      })
      .subscribe({
        next: data => {
          if (data) {
            // localStorage.setItem('data-user', JSON.stringify(data)); //after login

            // this.stateStorageService.setModulesOfProfil(); // modules-profil
            this.stateStorageService.setInfosuser(data.id);
          }

          this.authenticationError = false;
          if (!this.router.getCurrentNavigation()) {
            // There were no routing during login (eg from navigationToStoredUrl)
          }
        },
        error: () => (this.authenticationError = true),
      });
  }
}
