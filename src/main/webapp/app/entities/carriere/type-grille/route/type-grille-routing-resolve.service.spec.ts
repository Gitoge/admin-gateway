import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITypeGrille, TypeGrille } from '../type-grille.model';
import { TypeGrilleService } from '../service/type-grille.service';

import { TypeGrilleRoutingResolveService } from './type-grille-routing-resolve.service';

describe('TypeGrille routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TypeGrilleRoutingResolveService;
  let service: TypeGrilleService;
  let resultTypeGrille: ITypeGrille | undefined;

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
    routingResolveService = TestBed.inject(TypeGrilleRoutingResolveService);
    service = TestBed.inject(TypeGrilleService);
    resultTypeGrille = undefined;
  });

  describe('resolve', () => {
    it('should return ITypeGrille returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeGrille = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeGrille).toEqual({ id: 123 });
    });

    it('should return new ITypeGrille if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeGrille = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTypeGrille).toEqual(new TypeGrille());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TypeGrille })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeGrille = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeGrille).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
