import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPriseEnCompte, PriseEnCompte } from '../prise-en-compte.model';
import { PriseEnCompteService } from '../service/prise-en-compte.service';

import { PriseEnCompteRoutingResolveService } from './prise-en-compte-routing-resolve.service';

describe('PriseEnCompte routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PriseEnCompteRoutingResolveService;
  let service: PriseEnCompteService;
  let resultPriseEnCompte: IPriseEnCompte | undefined;

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
    routingResolveService = TestBed.inject(PriseEnCompteRoutingResolveService);
    service = TestBed.inject(PriseEnCompteService);
    resultPriseEnCompte = undefined;
  });

  describe('resolve', () => {
    it('should return IPriseEnCompte returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPriseEnCompte = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPriseEnCompte).toEqual({ id: 123 });
    });

    it('should return new IPriseEnCompte if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPriseEnCompte = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPriseEnCompte).toEqual(new PriseEnCompte());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PriseEnCompte })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPriseEnCompte = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPriseEnCompte).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
