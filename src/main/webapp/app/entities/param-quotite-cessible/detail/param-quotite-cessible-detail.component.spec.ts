import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParamQuotiteCessibleDetailComponent } from './param-quotite-cessible-detail.component';

describe('ParamQuotiteCessible Management Detail Component', () => {
  let comp: ParamQuotiteCessibleDetailComponent;
  let fixture: ComponentFixture<ParamQuotiteCessibleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParamQuotiteCessibleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paramQuotiteCessible: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParamQuotiteCessibleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParamQuotiteCessibleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paramQuotiteCessible on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paramQuotiteCessible).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
