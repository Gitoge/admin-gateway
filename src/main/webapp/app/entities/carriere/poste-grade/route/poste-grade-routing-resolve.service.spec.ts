import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPosteGrade, PosteGrade } from '../poste-grade.model';
import { PosteGradeService } from '../service/poste-grade.service';

import { PosteGradeRoutingResolveService } from './poste-grade-routing-resolve.service';

describe('PosteGrade routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PosteGradeRoutingResolveService;
  let service: PosteGradeService;
  let resultPosteGrade: IPosteGrade | undefined;

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
    routingResolveService = TestBed.inject(PosteGradeRoutingResolveService);
    service = TestBed.inject(PosteGradeService);
    resultPosteGrade = undefined;
  });

  describe('resolve', () => {
    it('should return IPosteGrade returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPosteGrade = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPosteGrade).toEqual({ id: 123 });
    });

    it('should return new IPosteGrade if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPosteGrade = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPosteGrade).toEqual(new PosteGrade());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PosteGrade })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPosteGrade = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPosteGrade).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
