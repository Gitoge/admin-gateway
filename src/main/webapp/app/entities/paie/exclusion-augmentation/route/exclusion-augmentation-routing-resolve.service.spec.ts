import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IExclusionAugmentation, ExclusionAugmentation } from '../exclusion-augmentation.model';
import { ExclusionAugmentationService } from '../service/exclusion-augmentation.service';

import { ExclusionAugmentationRoutingResolveService } from './exclusion-augmentation-routing-resolve.service';

describe('ExclusionAugmentation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ExclusionAugmentationRoutingResolveService;
  let service: ExclusionAugmentationService;
  let resultExclusionAugmentation: IExclusionAugmentation | undefined;

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
    routingResolveService = TestBed.inject(ExclusionAugmentationRoutingResolveService);
    service = TestBed.inject(ExclusionAugmentationService);
    resultExclusionAugmentation = undefined;
  });

  describe('resolve', () => {
    it('should return IExclusionAugmentation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExclusionAugmentation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExclusionAugmentation).toEqual({ id: 123 });
    });

    it('should return new IExclusionAugmentation if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExclusionAugmentation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultExclusionAugmentation).toEqual(new ExclusionAugmentation());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ExclusionAugmentation })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExclusionAugmentation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExclusionAugmentation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
