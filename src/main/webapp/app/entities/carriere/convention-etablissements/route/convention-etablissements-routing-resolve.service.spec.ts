import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IConventionEtablissements, ConventionEtablissements } from '../convention-etablissements.model';
import { ConventionEtablissementsService } from '../service/convention-etablissements.service';

import { ConventionEtablissementsRoutingResolveService } from './convention-etablissements-routing-resolve.service';

describe('ConventionEtablissements routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ConventionEtablissementsRoutingResolveService;
  let service: ConventionEtablissementsService;
  let resultConventionEtablissements: IConventionEtablissements | undefined;

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
    routingResolveService = TestBed.inject(ConventionEtablissementsRoutingResolveService);
    service = TestBed.inject(ConventionEtablissementsService);
    resultConventionEtablissements = undefined;
  });

  describe('resolve', () => {
    it('should return IConventionEtablissements returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultConventionEtablissements = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultConventionEtablissements).toEqual({ id: 123 });
    });

    it('should return new IConventionEtablissements if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultConventionEtablissements = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultConventionEtablissements).toEqual(new ConventionEtablissements());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ConventionEtablissements })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultConventionEtablissements = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultConventionEtablissements).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
