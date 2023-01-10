import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParamMatriculesDetailComponent } from './param-matricules-detail.component';

describe('ParamMatricules Management Detail Component', () => {
  let comp: ParamMatriculesDetailComponent;
  let fixture: ComponentFixture<ParamMatriculesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParamMatriculesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paramMatricules: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParamMatriculesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParamMatriculesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paramMatricules on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paramMatricules).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
