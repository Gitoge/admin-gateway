import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplications } from '../applications.model';

@Component({
  selector: 'jhi-applications-detail',
  templateUrl: './applications-detail.component.html',
})
export class ApplicationsDetailComponent implements OnInit {
  applications: IApplications | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applications }) => {
      this.applications = applications;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
