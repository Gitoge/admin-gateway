import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PagesService } from '../service/pages.service';
import { IPages, Pages } from '../pages.model';
import { IActions } from 'app/entities/actions/actions.model';
import { ActionsService } from 'app/entities/actions/service/actions.service';

import { PagesUpdateComponent } from './pages-update.component';
import { ModulesService } from 'app/entities/modules/service/modules.service';
import { IModules } from 'app/entities/modules/modules.model';

describe('Pages Management Update Component', () => {
  let comp: PagesUpdateComponent;
  let fixture: ComponentFixture<PagesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pagesService: PagesService;
  let actionsService: ActionsService;
  let modulesService: ModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PagesUpdateComponent],
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
      .overrideTemplate(PagesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PagesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pagesService = TestBed.inject(PagesService);
    actionsService = TestBed.inject(ActionsService);
    modulesService = TestBed.inject(ModulesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Actions query and add missing value', () => {
      const pages: IPages = { id: 456 };
      const actions: IActions[] = [{ id: 1739 }];
      pages.actions = actions;

      const actionsCollection: IActions[] = [{ id: 98896 }];
      jest.spyOn(actionsService, 'query').mockReturnValue(of(new HttpResponse({ body: actionsCollection })));
      const additionalActions = [...actions];
      const expectedCollection: IActions[] = [...additionalActions, ...actionsCollection];
      jest.spyOn(actionsService, 'addActionsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pages });
      comp.ngOnInit();

      expect(actionsService.query).toHaveBeenCalled();
      expect(actionsService.addActionsToCollectionIfMissing).toHaveBeenCalledWith(actionsCollection, ...additionalActions);
      expect(comp.actionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Modules query and add missing value', () => {
      const pages: IPages = { id: 456 };
      const modules: IModules = { id: 23390 };
      pages.modules = modules;

      const modulesCollection: IModules[] = [{ id: 98896 }];
      jest.spyOn(modulesService, 'query').mockReturnValue(of(new HttpResponse({ body: modulesCollection })));
      const additionalModules = [modules];
      const expectedCollection: IModules[] = [...additionalModules, ...modulesCollection];
      jest.spyOn(modulesService, 'addModulesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pages });
      comp.ngOnInit();

      expect(modulesService.query).toHaveBeenCalled();
      expect(modulesService.addModulesToCollectionIfMissing).toHaveBeenCalledWith(modulesCollection, ...additionalModules);
      expect(comp.modulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pages: IPages = { id: 456 };
      const actions: IActions = { id: 6175 };
      pages.actions = [actions];
      const modules: IModules = { id: 75299 };
      pages.modules = modules;

      activatedRoute.data = of({ pages });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pages));
      expect(comp.actionsSharedCollection).toContain(actions);
      expect(comp.modulesSharedCollection).toContain(modules);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pages>>();
      const pages = { id: 123 };
      jest.spyOn(pagesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pages }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pagesService.update).toHaveBeenCalledWith(pages);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pages>>();
      const pages = new Pages();
      jest.spyOn(pagesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pages }));
      saveSubject.complete();

      // THEN
      expect(pagesService.create).toHaveBeenCalledWith(pages);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pages>>();
      const pages = { id: 123 };
      jest.spyOn(pagesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pagesService.update).toHaveBeenCalledWith(pages);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackModulesById', () => {
      it('Should return tracked Modules primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackModulesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedActions', () => {
      it('Should return option if no Actions is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedActions(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Actions for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedActions(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Actions is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedActions(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
