import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmolumentsDetailComponent } from './emoluments-detail.component';

describe('Emoluments Management Detail Component', () => {
  let comp: EmolumentsDetailComponent;
  let fixture: ComponentFixture<EmolumentsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmolumentsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emoluments: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmolumentsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmolumentsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emoluments on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emoluments).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
