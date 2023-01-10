import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITypeReglement, TypeReglement } from '../type-reglement.model';
import { TypeReglementService } from '../service/type-reglement.service';

import { TypeReglementRoutingResolveService } from './type-reglement-routing-resolve.service';

describe('TypeReglement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TypeReglementRoutingResolveService;
  let service: TypeReglementService;
  let resultTypeReglement: ITypeReglement | undefined;

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
    routingResolveService = TestBed.inject(TypeReglementRoutingResolveService);
    service = TestBed.inject(TypeReglementService);
    resultTypeReglement = undefined;
  });

  describe('resolve', () => {
    it('should return ITypeReglement returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeReglement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeReglement).toEqual({ id: 123 });
    });

    it('should return new ITypeReglement if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeReglement = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTypeReglement).toEqual(new TypeReglement());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TypeReglement })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeReglement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeReglement).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
