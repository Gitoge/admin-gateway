import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReglementDetailComponent } from './reglement-detail.component';

describe('Reglement Management Detail Component', () => {
  let comp: ReglementDetailComponent;
  let fixture: ComponentFixture<ReglementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReglementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ reglement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReglementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReglementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load reglement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.reglement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
