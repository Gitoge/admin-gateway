import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiplomesDetailComponent } from './diplomes-detail.component';

describe('Diplomes Management Detail Component', () => {
  let comp: DiplomesDetailComponent;
  let fixture: ComponentFixture<DiplomesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiplomesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ diplomes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DiplomesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DiplomesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load diplomes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.diplomes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
