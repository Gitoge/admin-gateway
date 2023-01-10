import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IHierarchie, Hierarchie } from '../hierarchie.model';
import { HierarchieService } from '../service/hierarchie.service';

import { HierarchieRoutingResolveService } from './hierarchie-routing-resolve.service';

describe('Hierarchie routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HierarchieRoutingResolveService;
  let service: HierarchieService;
  let resultHierarchie: IHierarchie | undefined;

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
    routingResolveService = TestBed.inject(HierarchieRoutingResolveService);
    service = TestBed.inject(HierarchieService);
    resultHierarchie = undefined;
  });

  describe('resolve', () => {
    it('should return IHierarchie returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHierarchie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHierarchie).toEqual({ id: 123 });
    });

    it('should return new IHierarchie if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHierarchie = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultHierarchie).toEqual(new Hierarchie());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Hierarchie })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHierarchie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHierarchie).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
