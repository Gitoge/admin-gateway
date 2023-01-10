import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EchelonDetailComponent } from './echelon-detail.component';

describe('Echelon Management Detail Component', () => {
  let comp: EchelonDetailComponent;
  let fixture: ComponentFixture<EchelonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EchelonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ echelon: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EchelonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EchelonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load echelon on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.echelon).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
