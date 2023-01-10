import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StructureAdminService } from '../service/structure-admin.service';
import { IStructureAdmin, StructureAdmin } from '../structure-admin.model';

import { StructureAdminUpdateComponent } from './structure-admin-update.component';

describe('StructureAdmin Management Update Component', () => {
  let comp: StructureAdminUpdateComponent;
  let fixture: ComponentFixture<StructureAdminUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let structureAdminService: StructureAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StructureAdminUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StructureAdminUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StructureAdminUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    structureAdminService = TestBed.inject(StructureAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const structureAdmin: IStructureAdmin = { id: 456 };

      activatedRoute.data = of({ structureAdmin });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(structureAdmin));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StructureAdmin>>();
      const structureAdmin = { id: 123 };
      jest.spyOn(structureAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ structureAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: structureAdmin }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(structureAdminService.update).toHaveBeenCalledWith(structureAdmin);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StructureAdmin>>();
      const structureAdmin = new StructureAdmin();
      jest.spyOn(structureAdminService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ structureAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: structureAdmin }));
      saveSubject.complete();

      // THEN
      expect(structureAdminService.create).toHaveBeenCalledWith(structureAdmin);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StructureAdmin>>();
      const structureAdmin = { id: 123 };
      jest.spyOn(structureAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ structureAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(structureAdminService.update).toHaveBeenCalledWith(structureAdmin);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
