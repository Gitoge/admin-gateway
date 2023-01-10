import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ModulesService } from '../service/modules.service';
import { IModules, Modules } from '../modules.model';
import { IProfils } from 'app/entities/profils/profils.model';
import { ProfilsService } from 'app/entities/profils/service/profils.service';
import { IApplications } from 'app/entities/applications/applications.model';
import { ApplicationsService } from 'app/entities/applications/service/applications.service';

import { ModulesUpdateComponent } from './modules-update.component';

describe('Modules Management Update Component', () => {
  let comp: ModulesUpdateComponent;
  let fixture: ComponentFixture<ModulesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let modulesService: ModulesService;
  let profilsService: ProfilsService;
  let applicationsService: ApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ModulesUpdateComponent],
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
      .overrideTemplate(ModulesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModulesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    modulesService = TestBed.inject(ModulesService);
    profilsService = TestBed.inject(ProfilsService);
    applicationsService = TestBed.inject(ApplicationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Profils query and add missing value', () => {
      const modules: IModules = { id: 456 };
      const profils: IProfils[] = [{ id: 33391 }];
      modules.profils = profils;

      const profilsCollection: IProfils[] = [{ id: 22610 }];
      jest.spyOn(profilsService, 'query').mockReturnValue(of(new HttpResponse({ body: profilsCollection })));
      const additionalProfils = [...profils];
      const expectedCollection: IProfils[] = [...additionalProfils, ...profilsCollection];
      jest.spyOn(profilsService, 'addProfilsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ modules });
      comp.ngOnInit();

      expect(profilsService.query).toHaveBeenCalled();
      expect(profilsService.addProfilsToCollectionIfMissing).toHaveBeenCalledWith(profilsCollection, ...additionalProfils);
      expect(comp.profilsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Applications query and add missing value', () => {
      const modules: IModules = { id: 456 };
      const applications: IApplications = { id: 23390 };
      modules.applications = applications;

      const applicationsCollection: IApplications[] = [{ id: 11627 }];
      jest.spyOn(applicationsService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationsCollection })));
      const additionalApplications = [applications];
      const expectedCollection: IApplications[] = [...additionalApplications, ...applicationsCollection];
      jest.spyOn(applicationsService, 'addApplicationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ modules });
      comp.ngOnInit();

      expect(applicationsService.query).toHaveBeenCalled();
      expect(applicationsService.addApplicationsToCollectionIfMissing).toHaveBeenCalledWith(
        applicationsCollection,
        ...additionalApplications
      );
      expect(comp.applicationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const modules: IModules = { id: 456 };
      const profils: IProfils = { id: 13173 };
      modules.profils = [profils];
      const applications: IApplications = { id: 75299 };
      modules.applications = applications;

      activatedRoute.data = of({ modules });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(modules));
      expect(comp.profilsSharedCollection).toContain(profils);
      expect(comp.applicationsSharedCollection).toContain(applications);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Modules>>();
      const modules = { id: 123 };
      jest.spyOn(modulesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: modules }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(modulesService.update).toHaveBeenCalledWith(modules);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Modules>>();
      const modules = new Modules();
      jest.spyOn(modulesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: modules }));
      saveSubject.complete();

      // THEN
      expect(modulesService.create).toHaveBeenCalledWith(modules);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Modules>>();
      const modules = { id: 123 };
      jest.spyOn(modulesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(modulesService.update).toHaveBeenCalledWith(modules);
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

    describe('trackApplicationsById', () => {
      it('Should return tracked Applications primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackApplicationsById(0, entity);
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
