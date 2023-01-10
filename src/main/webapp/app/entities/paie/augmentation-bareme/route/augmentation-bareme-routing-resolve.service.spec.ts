import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAugmentationBareme, AugmentationBareme } from '../augmentation-bareme.model';
import { AugmentationBaremeService } from '../service/augmentation-bareme.service';

import { AugmentationBaremeRoutingResolveService } from './augmentation-bareme-routing-resolve.service';

describe('AugmentationBareme routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AugmentationBaremeRoutingResolveService;
  let service: AugmentationBaremeService;
  let resultAugmentationBareme: IAugmentationBareme | undefined;

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
    routingResolveService = TestBed.inject(AugmentationBaremeRoutingResolveService);
    service = TestBed.inject(AugmentationBaremeService);
    resultAugmentationBareme = undefined;
  });

  describe('resolve', () => {
    it('should return IAugmentationBareme returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationBareme = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAugmentationBareme).toEqual({ id: 123 });
    });

    it('should return new IAugmentationBareme if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationBareme = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAugmentationBareme).toEqual(new AugmentationBareme());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AugmentationBareme })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationBareme = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAugmentationBareme).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
