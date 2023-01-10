import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITypeLocalite, TypeLocalite } from '../type-localite.model';
import { TypeLocaliteService } from '../service/type-localite.service';

import { TypeLocaliteRoutingResolveService } from './type-localite-routing-resolve.service';

describe('TypeLocalite routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TypeLocaliteRoutingResolveService;
  let service: TypeLocaliteService;
  let resultTypeLocalite: ITypeLocalite | undefined;

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
    routingResolveService = TestBed.inject(TypeLocaliteRoutingResolveService);
    service = TestBed.inject(TypeLocaliteService);
    resultTypeLocalite = undefined;
  });

  describe('resolve', () => {
    it('should return ITypeLocalite returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeLocalite = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeLocalite).toEqual({ id: 123 });
    });

    it('should return new ITypeLocalite if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeLocalite = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTypeLocalite).toEqual(new TypeLocalite());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TypeLocalite })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeLocalite = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeLocalite).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
