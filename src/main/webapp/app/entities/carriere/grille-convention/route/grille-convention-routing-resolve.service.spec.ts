import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IGrilleConvention, GrilleConvention } from '../grille-convention.model';
import { GrilleConventionService } from '../service/grille-convention.service';

import { GrilleConventionRoutingResolveService } from './grille-convention-routing-resolve.service';

describe('GrilleConvention routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: GrilleConventionRoutingResolveService;
  let service: GrilleConventionService;
  let resultGrilleConvention: IGrilleConvention | undefined;

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
    routingResolveService = TestBed.inject(GrilleConventionRoutingResolveService);
    service = TestBed.inject(GrilleConventionService);
    resultGrilleConvention = undefined;
  });

  describe('resolve', () => {
    it('should return IGrilleConvention returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrilleConvention = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGrilleConvention).toEqual({ id: 123 });
    });

    it('should return new IGrilleConvention if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrilleConvention = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultGrilleConvention).toEqual(new GrilleConvention());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as GrilleConvention })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrilleConvention = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGrilleConvention).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
