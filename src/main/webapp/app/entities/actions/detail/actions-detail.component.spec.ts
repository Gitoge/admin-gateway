import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActionsDetailComponent } from './actions-detail.component';

describe('Actions Management Detail Component', () => {
  let comp: ActionsDetailComponent;
  let fixture: ComponentFixture<ActionsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ actions: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActionsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActionsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load actions on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.actions).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
