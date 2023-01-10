import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDestinataires, Destinataires } from '../destinataires.model';
import { DestinatairesService } from '../service/destinataires.service';

import { DestinatairesRoutingResolveService } from './destinataires-routing-resolve.service';

describe('Destinataires routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DestinatairesRoutingResolveService;
  let service: DestinatairesService;
  let resultDestinataires: IDestinataires | undefined;

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
    routingResolveService = TestBed.inject(DestinatairesRoutingResolveService);
    service = TestBed.inject(DestinatairesService);
    resultDestinataires = undefined;
  });

  describe('resolve', () => {
    it('should return IDestinataires returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDestinataires = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDestinataires).toEqual({ id: 123 });
    });

    it('should return new IDestinataires if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDestinataires = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDestinataires).toEqual(new Destinataires());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Destinataires })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDestinataires = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDestinataires).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
