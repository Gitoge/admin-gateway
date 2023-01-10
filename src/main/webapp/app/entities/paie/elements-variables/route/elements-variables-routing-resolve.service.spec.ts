import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IElementsVariables, ElementsVariables } from '../elements-variables.model';
import { ElementsVariablesService } from '../service/elements-variables.service';

import { ElementsVariablesRoutingResolveService } from './elements-variables-routing-resolve.service';

describe('ElementsVariables routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ElementsVariablesRoutingResolveService;
  let service: ElementsVariablesService;
  let resultElementsVariables: IElementsVariables | undefined;

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
    routingResolveService = TestBed.inject(ElementsVariablesRoutingResolveService);
    service = TestBed.inject(ElementsVariablesService);
    resultElementsVariables = undefined;
  });

  describe('resolve', () => {
    it('should return IElementsVariables returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultElementsVariables = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultElementsVariables).toEqual({ id: 123 });
    });

    it('should return new IElementsVariables if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultElementsVariables = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultElementsVariables).toEqual(new ElementsVariables());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ElementsVariables })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultElementsVariables = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultElementsVariables).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
