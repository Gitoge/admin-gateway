import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IExclusionTaux, ExclusionTaux } from '../exclusion-taux.model';
import { ExclusionTauxService } from '../service/exclusion-taux.service';

import { ExclusionTauxRoutingResolveService } from './exclusion-taux-routing-resolve.service';

describe('ExclusionTaux routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ExclusionTauxRoutingResolveService;
  let service: ExclusionTauxService;
  let resultExclusionTaux: IExclusionTaux | undefined;

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
    routingResolveService = TestBed.inject(ExclusionTauxRoutingResolveService);
    service = TestBed.inject(ExclusionTauxService);
    resultExclusionTaux = undefined;
  });

  describe('resolve', () => {
    it('should return IExclusionTaux returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExclusionTaux = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExclusionTaux).toEqual({ id: 123 });
    });

    it('should return new IExclusionTaux if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExclusionTaux = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultExclusionTaux).toEqual(new ExclusionTaux());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ExclusionTaux })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExclusionTaux = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExclusionTaux).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
