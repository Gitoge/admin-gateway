import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFichePaie, FichePaie } from '../fiche-paie.model';
import { FichePaieService } from '../service/fiche-paie.service';

import { FichePaieRoutingResolveService } from './fiche-paie-routing-resolve.service';

describe('FichePaie routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FichePaieRoutingResolveService;
  let service: FichePaieService;
  let resultFichePaie: IFichePaie | undefined;

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
    routingResolveService = TestBed.inject(FichePaieRoutingResolveService);
    service = TestBed.inject(FichePaieService);
    resultFichePaie = undefined;
  });

  describe('resolve', () => {
    it('should return IFichePaie returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFichePaie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFichePaie).toEqual({ id: 123 });
    });

    it('should return new IFichePaie if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFichePaie = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFichePaie).toEqual(new FichePaie());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FichePaie })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFichePaie = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFichePaie).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
