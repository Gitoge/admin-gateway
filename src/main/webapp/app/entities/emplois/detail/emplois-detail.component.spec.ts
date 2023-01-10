import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmploisDetailComponent } from './emplois-detail.component';

describe('Emplois Management Detail Component', () => {
  let comp: EmploisDetailComponent;
  let fixture: ComponentFixture<EmploisDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmploisDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emplois: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmploisDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmploisDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emplois on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emplois).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
