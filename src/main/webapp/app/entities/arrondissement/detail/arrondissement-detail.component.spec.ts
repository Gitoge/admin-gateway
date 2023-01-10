import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArrondissementDetailComponent } from './arrondissement-detail.component';

describe('Component Tests', () => {
  describe('Arrondissement Management Detail Component', () => {
    let comp: ArrondissementDetailComponent;
    let fixture: ComponentFixture<ArrondissementDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ArrondissementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ arrondissement: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ArrondissementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ArrondissementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load arrondissement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.arrondissement).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
