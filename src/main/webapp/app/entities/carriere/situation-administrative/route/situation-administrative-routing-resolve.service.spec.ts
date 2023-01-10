import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISituationAdministrative, SituationAdministrative } from '../situation-administrative.model';
import { SituationAdministrativeService } from '../service/situation-administrative.service';

import { SituationAdministrativeRoutingResolveService } from './situation-administrative-routing-resolve.service';

describe('SituationAdministrative routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SituationAdministrativeRoutingResolveService;
  let service: SituationAdministrativeService;
  let resultSituationAdministrative: ISituationAdministrative | undefined;

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
    routingResolveService = TestBed.inject(SituationAdministrativeRoutingResolveService);
    service = TestBed.inject(SituationAdministrativeService);
    resultSituationAdministrative = undefined;
  });

  describe('resolve', () => {
    it('should return ISituationAdministrative returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSituationAdministrative = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSituationAdministrative).toEqual({ id: 123 });
    });

    it('should return new ISituationAdministrative if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSituationAdministrative = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSituationAdministrative).toEqual(new SituationAdministrative());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SituationAdministrative })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSituationAdministrative = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSituationAdministrative).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
