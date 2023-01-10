import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ApplicationsService } from '../service/applications.service';
import { IApplications, Applications } from '../applications.model';

import { ApplicationsUpdateComponent } from './applications-update.component';

describe('Applications Management Update Component', () => {
  let comp: ApplicationsUpdateComponent;
  let fixture: ComponentFixture<ApplicationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let applicationsService: ApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ApplicationsUpdateComponent],
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
      .overrideTemplate(ApplicationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationsService = TestBed.inject(ApplicationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const applications: IApplications = { id: 456 };

      activatedRoute.data = of({ applications });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(applications));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Applications>>();
      const applications = { id: 123 };
      jest.spyOn(applicationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applications });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applications }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationsService.update).toHaveBeenCalledWith(applications);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Applications>>();
      const applications = new Applications();
      jest.spyOn(applicationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applications });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applications }));
      saveSubject.complete();

      // THEN
      expect(applicationsService.create).toHaveBeenCalledWith(applications);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Applications>>();
      const applications = { id: 123 };
      jest.spyOn(applicationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applications });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationsService.update).toHaveBeenCalledWith(applications);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
