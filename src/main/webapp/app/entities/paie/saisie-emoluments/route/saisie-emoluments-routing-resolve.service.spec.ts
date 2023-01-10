import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISaisieEmoluments, SaisieEmoluments } from '../saisie-emoluments.model';
import { SaisieEmolumentsService } from '../service/saisie-emoluments.service';

import { SaisieEmolumentsRoutingResolveService } from './saisie-emoluments-routing-resolve.service';

describe('SaisieEmoluments routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SaisieEmolumentsRoutingResolveService;
  let service: SaisieEmolumentsService;
  let resultSaisieEmoluments: ISaisieEmoluments | undefined;

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
    routingResolveService = TestBed.inject(SaisieEmolumentsRoutingResolveService);
    service = TestBed.inject(SaisieEmolumentsService);
    resultSaisieEmoluments = undefined;
  });

  describe('resolve', () => {
    it('should return ISaisieEmoluments returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSaisieEmoluments = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSaisieEmoluments).toEqual({ id: 123 });
    });

    it('should return new ISaisieEmoluments if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSaisieEmoluments = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSaisieEmoluments).toEqual(new SaisieEmoluments());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SaisieEmoluments })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSaisieEmoluments = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSaisieEmoluments).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
