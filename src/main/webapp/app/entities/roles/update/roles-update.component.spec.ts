import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RolesService } from '../service/roles.service';
import { IRoles, Roles } from '../roles.model';
import { IProfils } from 'app/entities/profils/profils.model';
import { ProfilsService } from 'app/entities/profils/service/profils.service';

import { RolesUpdateComponent } from './roles-update.component';

describe('Roles Management Update Component', () => {
  let comp: RolesUpdateComponent;
  let fixture: ComponentFixture<RolesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rolesService: RolesService;
  let profilsService: ProfilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RolesUpdateComponent],
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
      .overrideTemplate(RolesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RolesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rolesService = TestBed.inject(RolesService);
    profilsService = TestBed.inject(ProfilsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Profils query and add missing value', () => {
      const roles: IRoles = { id: 456 };
      const profils: IProfils[] = [{ id: 64945 }];
      roles.profils = profils;

      const profilsCollection: IProfils[] = [{ id: 11321 }];
      jest.spyOn(profilsService, 'query').mockReturnValue(of(new HttpResponse({ body: profilsCollection })));
      const additionalProfils = [...profils];
      const expectedCollection: IProfils[] = [...additionalProfils, ...profilsCollection];
      jest.spyOn(profilsService, 'addProfilsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      expect(profilsService.query).toHaveBeenCalled();
      expect(profilsService.addProfilsToCollectionIfMissing).toHaveBeenCalledWith(profilsCollection, ...additionalProfils);
      expect(comp.profilsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const roles: IRoles = { id: 456 };
      const profils: IProfils = { id: 31420 };
      roles.profils = [profils];

      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(roles));
      expect(comp.profilsSharedCollection).toContain(profils);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Roles>>();
      const roles = { id: 123 };
      jest.spyOn(rolesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roles }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(rolesService.update).toHaveBeenCalledWith(roles);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Roles>>();
      const roles = new Roles();
      jest.spyOn(rolesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roles }));
      saveSubject.complete();

      // THEN
      expect(rolesService.create).toHaveBeenCalledWith(roles);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Roles>>();
      const roles = { id: 123 };
      jest.spyOn(rolesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rolesService.update).toHaveBeenCalledWith(roles);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProfilsById', () => {
      it('Should return tracked Profils primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProfilsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedProfils', () => {
      it('Should return option if no Profils is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedProfils(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Profils for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedProfils(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Profils is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedProfils(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
