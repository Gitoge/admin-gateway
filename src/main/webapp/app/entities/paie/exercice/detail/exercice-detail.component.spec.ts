import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExerciceDetailComponent } from './exercice-detail.component';

describe('Exercice Management Detail Component', () => {
  let comp: ExerciceDetailComponent;
  let fixture: ComponentFixture<ExerciceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ exercice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExerciceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExerciceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load exercice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.exercice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
