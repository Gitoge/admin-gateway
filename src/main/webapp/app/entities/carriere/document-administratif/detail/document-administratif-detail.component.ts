import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentAdministratif } from '../document-administratif.model';

@Component({
  selector: 'jhi-document-administratif-detail',
  templateUrl: './document-administratif-detail.component.html',
})
export class DocumentAdministratifDetailComponent implements OnInit {
  documentAdministratif: IDocumentAdministratif | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentAdministratif }) => {
      this.documentAdministratif = documentAdministratif;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
