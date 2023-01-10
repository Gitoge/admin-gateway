import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserExtendedService } from '../service/user-extended.service';
import { IUserExtended, UserExtended } from '../user-extended.model';

import { UserExtendedUpdateComponent } from './user-extended-update.component';

describe('UserExtended Management Update Component', () => {
  let comp: UserExtendedUpdateComponent;
  let fixture: ComponentFixture<UserExtendedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userExtendedService: UserExtendedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserExtendedUpdateComponent],
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
      .overrideTemplate(UserExtendedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExtendedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userExtendedService = TestBed.inject(UserExtendedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userExtended: IUserExtended = { id: 456 };

      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userExtended));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserExtended>>();
      const userExtended = { id: 123 };
      jest.spyOn(userExtendedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtended }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userExtendedService.update).toHaveBeenCalledWith(userExtended);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserExtended>>();
      const userExtended = new UserExtended();
      jest.spyOn(userExtendedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtended }));
      saveSubject.complete();

      // THEN
      expect(userExtendedService.create).toHaveBeenCalledWith(userExtended);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserExtended>>();
      const userExtended = { id: 123 };
      jest.spyOn(userExtendedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtended });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userExtendedService.update).toHaveBeenCalledWith(userExtended);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
