import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IHierarchieCategorie, HierarchieCategorie } from '../hierarchie-categorie.model';
import { HierarchieCategorieService } from '../service/hierarchie-categorie.service';

import { HierarchieCategorieRoutingResolveService } from './hierarchie-categorie-routing-resolve.service';

describe('HierarchieCategorie routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HierarchieCategorieRoutingResolveService;
  let service: HierarchieCategorieService;
  let resultHierarchieCategorie: IHierarchieCategorie | undefined;

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
    routingResolveService = TestBed.inject(HierarchieCategorieRoutingResolveService);
    service = TestBed.inject(HierarchieCategorieService);
    resultHierarchieCategorie = undefined;
  });

  describe('resolve', () => {
    it('should return IHierarchieCategorie returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHierarchieCategorie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHierarchieCategorie).toEqual({ id: 123 });
    });

    it('should return new IHierarchieCategorie if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHierarchieCategorie = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultHierarchieCategorie).toEqual(new HierarchieCategorie());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as HierarchieCategorie })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHierarchieCategorie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHierarchieCategorie).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
