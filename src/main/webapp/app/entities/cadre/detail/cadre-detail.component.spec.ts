import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CadreDetailComponent } from './cadre-detail.component';

describe('Cadre Management Detail Component', () => {
  let comp: CadreDetailComponent;
  let fixture: ComponentFixture<CadreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cadre: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CadreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CadreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cadre on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cadre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
