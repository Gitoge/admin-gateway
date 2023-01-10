import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnfantDetailComponent } from './enfant-detail.component';

describe('Enfant Management Detail Component', () => {
  let comp: EnfantDetailComponent;
  let fixture: ComponentFixture<EnfantDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnfantDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ enfant: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EnfantDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EnfantDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load enfant on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.enfant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
