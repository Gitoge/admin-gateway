import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IParamBaremeMinimumFiscal, ParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';
import { ParamBaremeMinimumFiscalService } from '../service/param-bareme-minimum-fiscal.service';

import { ParamBaremeMinimumFiscalRoutingResolveService } from './param-bareme-minimum-fiscal-routing-resolve.service';

describe('ParamBaremeMinimumFiscal routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ParamBaremeMinimumFiscalRoutingResolveService;
  let service: ParamBaremeMinimumFiscalService;
  let resultParamBaremeMinimumFiscal: IParamBaremeMinimumFiscal | undefined;

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
    routingResolveService = TestBed.inject(ParamBaremeMinimumFiscalRoutingResolveService);
    service = TestBed.inject(ParamBaremeMinimumFiscalService);
    resultParamBaremeMinimumFiscal = undefined;
  });

  describe('resolve', () => {
    it('should return IParamBaremeMinimumFiscal returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamBaremeMinimumFiscal = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamBaremeMinimumFiscal).toEqual({ id: 123 });
    });

    it('should return new IParamBaremeMinimumFiscal if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamBaremeMinimumFiscal = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultParamBaremeMinimumFiscal).toEqual(new ParamBaremeMinimumFiscal());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ParamBaremeMinimumFiscal })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultParamBaremeMinimumFiscal = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultParamBaremeMinimumFiscal).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
