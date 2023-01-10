import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IParamPartsFiscales, ParamPartsFiscales } from '../param-parts-fiscales.model';
import { ParamPartsFiscalesService } from '../service/param-parts-fiscales.service';

import { ParamPartsFiscalesRoutingResolveService } from './param-parts-fiscales-routing-resolve.service';

describe('ParamPartsFiscales routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ParamPartsFiscalesRoutingResolveService;
  let service: ParamPartsFiscalesService;
  let resultParamPartsFiscales: IParamPartsFiscales | undefined;

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
    routingResolveService = TestBed.inject(ParamPartsFiscalesRoutingResolveService);
    service = TestBed.inject(ParamPartsFiscalesService);
    resultParamPartsFiscales = undefined;
  });

  describe('resolve', () => {
    it('should return IParamPartsFiscales returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamPartsFiscales = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamPartsFiscales).toEqual({ id: 123 });
    });

    it('should return new IParamPartsFiscales if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamPartsFiscales = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultParamPartsFiscales).toEqual(new ParamPartsFiscales());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ParamPartsFiscales })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamPartsFiscales = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamPartsFiscales).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
