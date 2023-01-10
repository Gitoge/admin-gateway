import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBaremeCalculHeuresSupp, BaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';
import { BaremeCalculHeuresSuppService } from '../service/bareme-calcul-heures-supp.service';

import { BaremeCalculHeuresSuppRoutingResolveService } from './bareme-calcul-heures-supp-routing-resolve.service';

describe('BaremeCalculHeuresSupp routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BaremeCalculHeuresSuppRoutingResolveService;
  let service: BaremeCalculHeuresSuppService;
  let resultBaremeCalculHeuresSupp: IBaremeCalculHeuresSupp | undefined;

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
    routingResolveService = TestBed.inject(BaremeCalculHeuresSuppRoutingResolveService);
    service = TestBed.inject(BaremeCalculHeuresSuppService);
    resultBaremeCalculHeuresSupp = undefined;
  });

  describe('resolve', () => {
    it('should return IBaremeCalculHeuresSupp returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBaremeCalculHeuresSupp = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBaremeCalculHeuresSupp).toEqual({ id: 123 });
    });

    it('should return new IBaremeCalculHeuresSupp if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBaremeCalculHeuresSupp = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBaremeCalculHeuresSupp).toEqual(new BaremeCalculHeuresSupp());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BaremeCalculHeuresSupp })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBaremeCalculHeuresSupp = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBaremeCalculHeuresSupp).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
