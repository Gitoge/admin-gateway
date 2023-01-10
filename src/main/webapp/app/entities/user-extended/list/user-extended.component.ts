import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserExtended } from '../user-extended.model';
import { UserExtendedService } from '../service/user-extended.service';
import { UserExtendedDeleteDialogComponent } from '../delete/user-extended-delete-dialog.component';

@Component({
  selector: 'jhi-user-extended',
  templateUrl: './user-extended.component.html',
})
export class UserExtendedComponent implements OnInit {
  userExtendeds?: IUserExtended[];
  isLoading = false;

  constructor(protected userExtendedService: UserExtendedService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userExtendedService.query().subscribe({
      next: (res: HttpResponse<IUserExtended[]>) => {
        this.isLoading = false;
        this.userExtendeds = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IUserExtended): number {
    return item.id!;
  }

  delete(userExtended: IUserExtended): void {
    const modalRef = this.modalService.open(UserExtendedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userExtended = userExtended;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
