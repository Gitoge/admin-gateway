import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISaisieElementsVariables, SaisieElementsVariables } from '../saisie-elements-variables.model';
import { SaisieElementsVariablesService } from '../service/saisie-elements-variables.service';

import { SaisieElementsVariablesRoutingResolveService } from './saisie-elements-variables-routing-resolve.service';

describe('SaisieElementsVariables routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SaisieElementsVariablesRoutingResolveService;
  let service: SaisieElementsVariablesService;
  let resultSaisieElementsVariables: ISaisieElementsVariables | undefined;

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
    routingResolveService = TestBed.inject(SaisieElementsVariablesRoutingResolveService);
    service = TestBed.inject(SaisieElementsVariablesService);
    resultSaisieElementsVariables = undefined;
  });

  describe('resolve', () => {
    it('should return ISaisieElementsVariables returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSaisieElementsVariables = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSaisieElementsVariables).toEqual({ id: 123 });
    });

    it('should return new ISaisieElementsVariables if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSaisieElementsVariables = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSaisieElementsVariables).toEqual(new SaisieElementsVariables());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SaisieElementsVariables })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSaisieElementsVariables = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSaisieElementsVariables).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
