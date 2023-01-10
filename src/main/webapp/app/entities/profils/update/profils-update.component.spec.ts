import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProfilsService } from '../service/profils.service';
import { IProfils, Profils } from '../profils.model';
import { IRoles } from 'app/entities/roles/roles.model';
import { RolesService } from 'app/entities/roles/service/roles.service';

import { ProfilsUpdateComponent } from './profils-update.component';

describe('Profils Management Update Component', () => {
  let comp: ProfilsUpdateComponent;
  let fixture: ComponentFixture<ProfilsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profilsService: ProfilsService;
  let rolesService: RolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProfilsUpdateComponent],
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
      .overrideTemplate(ProfilsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfilsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profilsService = TestBed.inject(ProfilsService);
    rolesService = TestBed.inject(RolesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Roles query and add missing value', () => {
      const profils: IProfils = { id: 456 };
      const roles: IRoles[] = [{ id: 39300 }];
      profils.roles = roles;

      const rolesCollection: IRoles[] = [{ id: 45147 }];
      jest.spyOn(rolesService, 'query').mockReturnValue(of(new HttpResponse({ body: rolesCollection })));
      const additionalRoles = [...roles];
      const expectedCollection: IRoles[] = [...additionalRoles, ...rolesCollection];
      jest.spyOn(rolesService, 'addRolesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profils });
      comp.ngOnInit();

      expect(rolesService.query).toHaveBeenCalled();
      expect(rolesService.addRolesToCollectionIfMissing).toHaveBeenCalledWith(rolesCollection, ...additionalRoles);
      expect(comp.rolesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const profils: IProfils = { id: 456 };
      const roles: IRoles = { id: 26754 };
      profils.roles = [roles];

      activatedRoute.data = of({ profils });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(profils));
      expect(comp.rolesSharedCollection).toContain(roles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profils>>();
      const profils = { id: 123 };
      jest.spyOn(profilsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profils });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profils }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(profilsService.update).toHaveBeenCalledWith(profils);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profils>>();
      const profils = new Profils();
      jest.spyOn(profilsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profils });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profils }));
      saveSubject.complete();

      // THEN
      expect(profilsService.create).toHaveBeenCalledWith(profils);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Profils>>();
      const profils = { id: 123 };
      jest.spyOn(profilsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profils });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profilsService.update).toHaveBeenCalledWith(profils);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRolesById', () => {
      it('Should return tracked Roles primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRolesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedRoles', () => {
      it('Should return option if no Roles is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedRoles(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Roles for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedRoles(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Roles is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedRoles(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
