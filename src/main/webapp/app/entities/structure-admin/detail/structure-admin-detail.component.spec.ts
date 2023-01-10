import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StructureAdminDetailComponent } from './structure-admin-detail.component';

describe('StructureAdmin Management Detail Component', () => {
  let comp: StructureAdminDetailComponent;
  let fixture: ComponentFixture<StructureAdminDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StructureAdminDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ structureAdmin: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StructureAdminDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StructureAdminDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load structureAdmin on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.structureAdmin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
