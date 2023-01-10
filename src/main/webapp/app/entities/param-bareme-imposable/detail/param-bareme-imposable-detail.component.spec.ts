import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParamBaremeImposableDetailComponent } from './param-bareme-imposable-detail.component';

describe('ParamBaremeImposable Management Detail Component', () => {
  let comp: ParamBaremeImposableDetailComponent;
  let fixture: ComponentFixture<ParamBaremeImposableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParamBaremeImposableDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paramBaremeImposable: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParamBaremeImposableDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParamBaremeImposableDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paramBaremeImposable on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paramBaremeImposable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
