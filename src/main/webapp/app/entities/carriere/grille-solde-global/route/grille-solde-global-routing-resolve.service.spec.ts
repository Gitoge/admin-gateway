import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IGrilleSoldeGlobal, GrilleSoldeGlobal } from '../grille-solde-global.model';
import { GrilleSoldeGlobalService } from '../service/grille-solde-global.service';

import { GrilleSoldeGlobalRoutingResolveService } from './grille-solde-global-routing-resolve.service';

describe('GrilleSoldeGlobal routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: GrilleSoldeGlobalRoutingResolveService;
  let service: GrilleSoldeGlobalService;
  let resultGrilleSoldeGlobal: IGrilleSoldeGlobal | undefined;

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
    routingResolveService = TestBed.inject(GrilleSoldeGlobalRoutingResolveService);
    service = TestBed.inject(GrilleSoldeGlobalService);
    resultGrilleSoldeGlobal = undefined;
  });

  describe('resolve', () => {
    it('should return IGrilleSoldeGlobal returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrilleSoldeGlobal = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGrilleSoldeGlobal).toEqual({ id: 123 });
    });

    it('should return new IGrilleSoldeGlobal if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrilleSoldeGlobal = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultGrilleSoldeGlobal).toEqual(new GrilleSoldeGlobal());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as GrilleSoldeGlobal })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrilleSoldeGlobal = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGrilleSoldeGlobal).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
