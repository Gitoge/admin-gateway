import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAugmentationHierarchie, AugmentationHierarchie } from '../augmentation-hierarchie.model';
import { AugmentationHierarchieService } from '../service/augmentation-hierarchie.service';

import { AugmentationHierarchieRoutingResolveService } from './augmentation-hierarchie-routing-resolve.service';

describe('AugmentationHierarchie routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AugmentationHierarchieRoutingResolveService;
  let service: AugmentationHierarchieService;
  let resultAugmentationHierarchie: IAugmentationHierarchie | undefined;

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
    routingResolveService = TestBed.inject(AugmentationHierarchieRoutingResolveService);
    service = TestBed.inject(AugmentationHierarchieService);
    resultAugmentationHierarchie = undefined;
  });

  describe('resolve', () => {
    it('should return IAugmentationHierarchie returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationHierarchie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAugmentationHierarchie).toEqual({ id: 123 });
    });

    it('should return new IAugmentationHierarchie if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationHierarchie = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAugmentationHierarchie).toEqual(new AugmentationHierarchie());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AugmentationHierarchie })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationHierarchie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAugmentationHierarchie).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
