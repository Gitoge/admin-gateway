import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CategorieActesDetailComponent } from './categorie-actes-detail.component';

describe('CategorieActes Management Detail Component', () => {
  let comp: CategorieActesDetailComponent;
  let fixture: ComponentFixture<CategorieActesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieActesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ categorieActes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CategorieActesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CategorieActesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load categorieActes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.categorieActes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
