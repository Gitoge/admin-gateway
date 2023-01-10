import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPostesNonCumulabe, PostesNonCumulabe } from '../postes-non-cumulabe.model';
import { PostesNonCumulabeService } from '../service/postes-non-cumulabe.service';

import { PostesNonCumulabeRoutingResolveService } from './postes-non-cumulabe-routing-resolve.service';

describe('PostesNonCumulabe routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PostesNonCumulabeRoutingResolveService;
  let service: PostesNonCumulabeService;
  let resultPostesNonCumulabe: IPostesNonCumulabe | undefined;

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
    routingResolveService = TestBed.inject(PostesNonCumulabeRoutingResolveService);
    service = TestBed.inject(PostesNonCumulabeService);
    resultPostesNonCumulabe = undefined;
  });

  describe('resolve', () => {
    it('should return IPostesNonCumulabe returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPostesNonCumulabe = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPostesNonCumulabe).toEqual({ id: 123 });
    });

    it('should return new IPostesNonCumulabe if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPostesNonCumulabe = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPostesNonCumulabe).toEqual(new PostesNonCumulabe());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PostesNonCumulabe })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPostesNonCumulabe = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPostesNonCumulabe).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
