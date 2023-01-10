import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IParamMatricules, ParamMatricules } from '../param-matricules.model';
import { ParamMatriculesService } from '../service/param-matricules.service';

import { ParamMatriculesRoutingResolveService } from './param-matricules-routing-resolve.service';

describe('ParamMatricules routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ParamMatriculesRoutingResolveService;
  let service: ParamMatriculesService;
  let resultParamMatricules: IParamMatricules | undefined;

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
    routingResolveService = TestBed.inject(ParamMatriculesRoutingResolveService);
    service = TestBed.inject(ParamMatriculesService);
    resultParamMatricules = undefined;
  });

  describe('resolve', () => {
    it('should return IParamMatricules returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamMatricules = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamMatricules).toEqual({ id: 123 });
    });

    it('should return new IParamMatricules if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamMatricules = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultParamMatricules).toEqual(new ParamMatricules());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ParamMatricules })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamMatricules = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamMatricules).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
