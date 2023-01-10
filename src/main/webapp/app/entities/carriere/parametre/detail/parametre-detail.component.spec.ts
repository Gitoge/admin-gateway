import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParametreDetailComponent } from './parametre-detail.component';

describe('Parametre Management Detail Component', () => {
  let comp: ParametreDetailComponent;
  let fixture: ComponentFixture<ParametreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parametre: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParametreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParametreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parametre on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parametre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
