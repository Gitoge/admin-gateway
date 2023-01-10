import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParamPartsFiscalesDetailComponent } from './param-parts-fiscales-detail.component';

describe('ParamPartsFiscales Management Detail Component', () => {
  let comp: ParamPartsFiscalesDetailComponent;
  let fixture: ComponentFixture<ParamPartsFiscalesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParamPartsFiscalesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paramPartsFiscales: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParamPartsFiscalesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParamPartsFiscalesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paramPartsFiscales on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paramPartsFiscales).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
