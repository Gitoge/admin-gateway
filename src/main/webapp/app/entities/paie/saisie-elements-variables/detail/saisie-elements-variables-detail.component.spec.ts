import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SaisieElementsVariablesDetailComponent } from './saisie-elements-variables-detail.component';

describe('SaisieElementsVariables Management Detail Component', () => {
  let comp: SaisieElementsVariablesDetailComponent;
  let fixture: ComponentFixture<SaisieElementsVariablesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaisieElementsVariablesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ saisieElementsVariables: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SaisieElementsVariablesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SaisieElementsVariablesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load saisieElementsVariables on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.saisieElementsVariables).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
