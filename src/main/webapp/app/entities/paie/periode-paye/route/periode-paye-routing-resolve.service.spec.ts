import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPeriodePaye, PeriodePaye } from '../periode-paye.model';
import { PeriodePayeService } from '../service/periode-paye.service';

import { PeriodePayeRoutingResolveService } from './periode-paye-routing-resolve.service';

describe('PeriodePaye routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PeriodePayeRoutingResolveService;
  let service: PeriodePayeService;
  let resultPeriodePaye: IPeriodePaye | undefined;

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
    routingResolveService = TestBed.inject(PeriodePayeRoutingResolveService);
    service = TestBed.inject(PeriodePayeService);
    resultPeriodePaye = undefined;
  });

  describe('resolve', () => {
    it('should return IPeriodePaye returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPeriodePaye = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPeriodePaye).toEqual({ id: 123 });
    });

    it('should return new IPeriodePaye if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPeriodePaye = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPeriodePaye).toEqual(new PeriodePaye());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PeriodePaye })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPeriodePaye = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPeriodePaye).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
