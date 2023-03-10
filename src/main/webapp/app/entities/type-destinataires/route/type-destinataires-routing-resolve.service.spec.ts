import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITypeDestinataires, TypeDestinataires } from '../type-destinataires.model';
import { TypeDestinatairesService } from '../service/type-destinataires.service';

import { TypeDestinatairesRoutingResolveService } from './type-destinataires-routing-resolve.service';

describe('TypeDestinataires routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TypeDestinatairesRoutingResolveService;
  let service: TypeDestinatairesService;
  let resultTypeDestinataires: ITypeDestinataires | undefined;

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
    routingResolveService = TestBed.inject(TypeDestinatairesRoutingResolveService);
    service = TestBed.inject(TypeDestinatairesService);
    resultTypeDestinataires = undefined;
  });

  describe('resolve', () => {
    it('should return ITypeDestinataires returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeDestinataires = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeDestinataires).toEqual({ id: 123 });
    });

    it('should return new ITypeDestinataires if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeDestinataires = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTypeDestinataires).toEqual(new TypeDestinataires());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TypeDestinataires })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTypeDestinataires = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTypeDestinataires).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
