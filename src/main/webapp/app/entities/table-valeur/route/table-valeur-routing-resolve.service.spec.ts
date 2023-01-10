import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITableValeur, TableValeur } from '../table-valeur.model';
import { TableValeurService } from '../service/table-valeur.service';

import { TableValeurRoutingResolveService } from './table-valeur-routing-resolve.service';

describe('TableValeur routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TableValeurRoutingResolveService;
  let service: TableValeurService;
  let resultTableValeur: ITableValeur | undefined;

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
    routingResolveService = TestBed.inject(TableValeurRoutingResolveService);
    service = TestBed.inject(TableValeurService);
    resultTableValeur = undefined;
  });

  describe('resolve', () => {
    it('should return ITableValeur returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTableValeur = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTableValeur).toEqual({ id: 123 });
    });

    it('should return new ITableValeur if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTableValeur = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTableValeur).toEqual(new TableValeur());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TableValeur })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTableValeur = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTableValeur).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
