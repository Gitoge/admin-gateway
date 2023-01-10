import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ElementsVariablesDetailComponent } from './elements-variables-detail.component';

describe('ElementsVariables Management Detail Component', () => {
  let comp: ElementsVariablesDetailComponent;
  let fixture: ComponentFixture<ElementsVariablesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementsVariablesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ elementsVariables: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ElementsVariablesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ElementsVariablesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load elementsVariables on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.elementsVariables).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
