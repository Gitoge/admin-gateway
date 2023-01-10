import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeGrilleDetailComponent } from './type-grille-detail.component';

describe('TypeGrille Management Detail Component', () => {
  let comp: TypeGrilleDetailComponent;
  let fixture: ComponentFixture<TypeGrilleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeGrilleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeGrille: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeGrilleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeGrilleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeGrille on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeGrille).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
