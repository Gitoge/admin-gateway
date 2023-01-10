import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActesDetailComponent } from './actes-detail.component';

describe('Actes Management Detail Component', () => {
  let comp: ActesDetailComponent;
  let fixture: ComponentFixture<ActesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ actes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load actes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.actes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
