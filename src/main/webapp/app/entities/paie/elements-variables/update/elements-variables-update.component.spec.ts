import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ElementsVariablesService } from '../service/elements-variables.service';
import { IElementsVariables, ElementsVariables } from '../elements-variables.model';
import { IPostes } from 'app/entities/paie/postes/postes.model';
import { PostesService } from 'app/entities/paie/postes/service/postes.service';

import { ElementsVariablesUpdateComponent } from './elements-variables-update.component';

describe('ElementsVariables Management Update Component', () => {
  let comp: ElementsVariablesUpdateComponent;
  let fixture: ComponentFixture<ElementsVariablesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let elementsVariablesService: ElementsVariablesService;
  let postesService: PostesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ElementsVariablesUpdateComponent],
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
      .overrideTemplate(ElementsVariablesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ElementsVariablesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    elementsVariablesService = TestBed.inject(ElementsVariablesService);
    postesService = TestBed.inject(PostesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Postes query and add missing value', () => {
      const elementsVariables: IElementsVariables = { id: 456 };
      const postes: IPostes = { id: 67010 };
      elementsVariables.postes = postes;

      const postesCollection: IPostes[] = [{ id: 40707 }];
      jest.spyOn(postesService, 'query').mockReturnValue(of(new HttpResponse({ body: postesCollection })));
      const additionalPostes = [postes];
      const expectedCollection: IPostes[] = [...additionalPostes, ...postesCollection];
      jest.spyOn(postesService, 'addPostesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ elementsVariables });
      comp.ngOnInit();

      expect(postesService.query).toHaveBeenCalled();
      expect(postesService.addPostesToCollectionIfMissing).toHaveBeenCalledWith(postesCollection, ...additionalPostes);
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const elementsVariables: IElementsVariables = { id: 456 };
      const postes: IPostes = { id: 75546 };
      elementsVariables.postes = postes;

      activatedRoute.data = of({ elementsVariables });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(elementsVariables));
      expect(comp.postesSharedCollection).toContain(postes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ElementsVariables>>();
      const elementsVariables = { id: 123 };
      jest.spyOn(elementsVariablesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ elementsVariables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: elementsVariables }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(elementsVariablesService.update).toHaveBeenCalledWith(elementsVariables);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ElementsVariables>>();
      const elementsVariables = new ElementsVariables();
      jest.spyOn(elementsVariablesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ elementsVariables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: elementsVariables }));
      saveSubject.complete();

      // THEN
      expect(elementsVariablesService.create).toHaveBeenCalledWith(elementsVariables);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ElementsVariables>>();
      const elementsVariables = { id: 123 };
      jest.spyOn(elementsVariablesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ elementsVariables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(elementsVariablesService.update).toHaveBeenCalledWith(elementsVariables);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPostesById', () => {
      it('Should return tracked Postes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPostesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
