import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAugmentationIndice, AugmentationIndice } from '../augmentation-indice.model';
import { AugmentationIndiceService } from '../service/augmentation-indice.service';

import { AugmentationIndiceRoutingResolveService } from './augmentation-indice-routing-resolve.service';

describe('AugmentationIndice routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AugmentationIndiceRoutingResolveService;
  let service: AugmentationIndiceService;
  let resultAugmentationIndice: IAugmentationIndice | undefined;

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
    routingResolveService = TestBed.inject(AugmentationIndiceRoutingResolveService);
    service = TestBed.inject(AugmentationIndiceService);
    resultAugmentationIndice = undefined;
  });

  describe('resolve', () => {
    it('should return IAugmentationIndice returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationIndice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAugmentationIndice).toEqual({ id: 123 });
    });

    it('should return new IAugmentationIndice if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationIndice = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAugmentationIndice).toEqual(new AugmentationIndice());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AugmentationIndice })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAugmentationIndice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAugmentationIndice).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
