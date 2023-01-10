import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParamBaremeMinimumFiscalDetailComponent } from './param-bareme-minimum-fiscal-detail.component';

describe('ParamBaremeMinimumFiscal Management Detail Component', () => {
  let comp: ParamBaremeMinimumFiscalDetailComponent;
  let fixture: ComponentFixture<ParamBaremeMinimumFiscalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParamBaremeMinimumFiscalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paramBaremeMinimumFiscal: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParamBaremeMinimumFiscalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParamBaremeMinimumFiscalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paramBaremeMinimumFiscal on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paramBaremeMinimumFiscal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
