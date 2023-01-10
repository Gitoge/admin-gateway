import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPosteCompoGrade, PosteCompoGrade } from '../poste-compo-grade.model';
import { PosteCompoGradeService } from '../service/poste-compo-grade.service';

import { PosteCompoGradeRoutingResolveService } from './poste-compo-grade-routing-resolve.service';

describe('PosteCompoGrade routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PosteCompoGradeRoutingResolveService;
  let service: PosteCompoGradeService;
  let resultPosteCompoGrade: IPosteCompoGrade | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(PosteCompoGradeRoutingResolveService);
    service = TestBed.inject(PosteCompoGradeService);
    resultPosteCompoGrade = undefined;
  });

  describe('resolve', () => {
    it('should return IPosteCompoGrade returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPosteCompoGrade = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPosteCompoGrade).toEqual({ id: 123 });
    });

    it('should return new IPosteCompoGrade if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPosteCompoGrade = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPosteCompoGrade).toEqual(new PosteCompoGrade());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PosteCompoGrade })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPosteCompoGrade = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPosteCompoGrade).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
