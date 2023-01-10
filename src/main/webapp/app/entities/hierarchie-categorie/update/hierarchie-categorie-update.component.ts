import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHierarchieCategorie, HierarchieCategorie } from '../hierarchie-categorie.model';
import { HierarchieCategorieService } from '../service/hierarchie-categorie.service';
import { IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { ICategorie } from 'app/entities/categorie/categorie.model';
import { HierarchieService } from 'app/entities/hierarchie/service/hierarchie.service';
import { CategorieService } from 'app/entities/categorie/service/categorie.service';

@Component({
  selector: 'jhi-hierarchie-categorie-update',
  templateUrl: './hierarchie-categorie-update.component.html',
})
export class HierarchieCategorieUpdateComponent implements OnInit {
  isSaving = false;

  hierarchies!: IHierarchie[];

  categories!: ICategorie[];

  hierarchieCategorie!: IHierarchieCategorie;

  editForm = this.fb.group({
    id: [],
    hierarchieId: [null, [Validators.required]],
    categorieId: [null, [Validators.required]],
  });

  constructor(
    protected hierarchieCategorieService: HierarchieCategorieService,
    protected activatedRoute: ActivatedRoute,
    protected hierarchieService: HierarchieService,
    protected categorieService: CategorieService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hierarchieCategorie }) => {
      this.hierarchieCategorie = hierarchieCategorie;
    });

    this.categorieService
      .findAll()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(map((categories: ICategorie[]) => this.categorieService.addCategorieToCollectionIfMissing(categories)))
      .subscribe((categories: ICategorie[]) => (this.categories = categories));

    this.hierarchieService
      .findAll()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(map((hierarchie: IHierarchie[]) => this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie)))
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchies = hierarchie));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    console.error(this.hierarchieCategorie);
    // this.hierarchieCategorie.categorieId = this.hierarchieCategorie.categories?.id;
    // this.hierarchieCategorie.hierarchieId = this.hierarchieCategorie.hierarchie?.id;

    if (this.hierarchieCategorie.id !== undefined) {
      this.subscribeToSaveResponse(this.hierarchieCategorieService.update(this.hierarchieCategorie));
    } else {
      this.subscribeToSaveResponse(this.hierarchieCategorieService.create(this.hierarchieCategorie));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHierarchieCategorie>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
