import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParamBulletinsService } from '../service/param-bulletins.service';
import { IParamBulletins, ParamBulletins } from '../param-bulletins.model';

import { ParamBulletinsUpdateComponent } from './param-bulletins-update.component';

describe('ParamBulletins Management Update Component', () => {
  let comp: ParamBulletinsUpdateComponent;
  let fixture: ComponentFixture<ParamBulletinsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paramBulletinsService: ParamBulletinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParamBulletinsUpdateComponent],
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
      .overrideTemplate(ParamBulletinsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParamBulletinsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paramBulletinsService = TestBed.inject(ParamBulletinsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paramBulletins: IParamBulletins = { id: 456 };

      activatedRoute.data = of({ paramBulletins });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paramBulletins));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBulletins>>();
      const paramBulletins = { id: 123 };
      jest.spyOn(paramBulletinsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBulletins });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramBulletins }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paramBulletinsService.update).toHaveBeenCalledWith(paramBulletins);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBulletins>>();
      const paramBulletins = new ParamBulletins();
      jest.spyOn(paramBulletinsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBulletins });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramBulletins }));
      saveSubject.complete();

      // THEN
      expect(paramBulletinsService.create).toHaveBeenCalledWith(paramBulletins);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBulletins>>();
      const paramBulletins = { id: 123 };
      jest.spyOn(paramBulletinsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBulletins });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paramBulletinsService.update).toHaveBeenCalledWith(paramBulletins);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
