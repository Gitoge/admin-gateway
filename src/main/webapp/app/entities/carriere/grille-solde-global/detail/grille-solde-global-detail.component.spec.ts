import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrilleSoldeGlobalDetailComponent } from './grille-solde-global-detail.component';

describe('GrilleSoldeGlobal Management Detail Component', () => {
  let comp: GrilleSoldeGlobalDetailComponent;
  let fixture: ComponentFixture<GrilleSoldeGlobalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrilleSoldeGlobalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grilleSoldeGlobal: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrilleSoldeGlobalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrilleSoldeGlobalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grilleSoldeGlobal on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grilleSoldeGlobal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
