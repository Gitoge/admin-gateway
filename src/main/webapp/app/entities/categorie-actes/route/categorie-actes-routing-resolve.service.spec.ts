import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICategorieActes, CategorieActes } from '../categorie-actes.model';
import { CategorieActesService } from '../service/categorie-actes.service';

import { CategorieActesRoutingResolveService } from './categorie-actes-routing-resolve.service';

describe('CategorieActes routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CategorieActesRoutingResolveService;
  let service: CategorieActesService;
  let resultCategorieActes: ICategorieActes | undefined;

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
    routingResolveService = TestBed.inject(CategorieActesRoutingResolveService);
    service = TestBed.inject(CategorieActesService);
    resultCategorieActes = undefined;
  });

  describe('resolve', () => {
    it('should return ICategorieActes returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategorieActes = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCategorieActes).toEqual({ id: 123 });
    });

    it('should return new ICategorieActes if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategorieActes = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCategorieActes).toEqual(new CategorieActes());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CategorieActes })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategorieActes = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCategorieActes).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
