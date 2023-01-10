import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AvancementDetailComponent } from './avancement-detail.component';

describe('Avancement Management Detail Component', () => {
  let comp: AvancementDetailComponent;
  let fixture: ComponentFixture<AvancementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ avancement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AvancementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AvancementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load avancement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.avancement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
