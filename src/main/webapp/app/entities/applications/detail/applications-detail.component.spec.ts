import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApplicationsDetailComponent } from './applications-detail.component';

describe('Applications Management Detail Component', () => {
  let comp: ApplicationsDetailComponent;
  let fixture: ComponentFixture<ApplicationsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ applications: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ApplicationsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ApplicationsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load applications on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.applications).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
