import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProfilsDetailComponent } from './profils-detail.component';

describe('Profils Management Detail Component', () => {
  let comp: ProfilsDetailComponent;
  let fixture: ComponentFixture<ProfilsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ profils: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProfilsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProfilsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load profils on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.profils).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
