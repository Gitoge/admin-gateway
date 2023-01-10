import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IParamQuotiteCessible, ParamQuotiteCessible } from '../param-quotite-cessible.model';
import { ParamQuotiteCessibleService } from '../service/param-quotite-cessible.service';

import { ParamQuotiteCessibleRoutingResolveService } from './param-quotite-cessible-routing-resolve.service';

describe('ParamQuotiteCessible routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ParamQuotiteCessibleRoutingResolveService;
  let service: ParamQuotiteCessibleService;
  let resultParamQuotiteCessible: IParamQuotiteCessible | undefined;

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
    routingResolveService = TestBed.inject(ParamQuotiteCessibleRoutingResolveService);
    service = TestBed.inject(ParamQuotiteCessibleService);
    resultParamQuotiteCessible = undefined;
  });

  describe('resolve', () => {
    it('should return IParamQuotiteCessible returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamQuotiteCessible = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamQuotiteCessible).toEqual({ id: 123 });
    });

    it('should return new IParamQuotiteCessible if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamQuotiteCessible = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultParamQuotiteCessible).toEqual(new ParamQuotiteCessible());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ParamQuotiteCessible })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamQuotiteCessible = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamQuotiteCessible).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
