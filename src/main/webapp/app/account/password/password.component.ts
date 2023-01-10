import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html',
})
export class PasswordComponent implements OnInit {
  doNotMatch = false;
  error = false;
  success = false;
  @Output() clickevent = new EventEmitter<string>();
  isNavbarCollapsed = true;

  account$?: Observable<Account | null>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  constructor(
    private passwordService: PasswordService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
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
  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
        () => (this.success = true),
        () => (this.error = true)
      );
      this.close();
      this.logout();
    }
  }
}
