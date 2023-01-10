import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEmoluments, Emoluments } from '../emoluments.model';
import { EmolumentsService } from '../service/emoluments.service';

import { EmolumentsRoutingResolveService } from './emoluments-routing-resolve.service';

describe('Emoluments routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EmolumentsRoutingResolveService;
  let service: EmolumentsService;
  let resultEmoluments: IEmoluments | undefined;

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
    routingResolveService = TestBed.inject(EmolumentsRoutingResolveService);
    service = TestBed.inject(EmolumentsService);
    resultEmoluments = undefined;
  });

  describe('resolve', () => {
    it('should return IEmoluments returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmoluments = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmoluments).toEqual({ id: 123 });
    });

    it('should return new IEmoluments if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmoluments = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEmoluments).toEqual(new Emoluments());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Emoluments })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmoluments = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmoluments).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
