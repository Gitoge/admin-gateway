import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEtablissementBancaire, EtablissementBancaire } from '../etablissement-bancaire.model';
import { EtablissementBancaireService } from '../service/etablissement-bancaire.service';

import { EtablissementBancaireRoutingResolveService } from './etablissement-bancaire-routing-resolve.service';

describe('EtablissementBancaire routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EtablissementBancaireRoutingResolveService;
  let service: EtablissementBancaireService;
  let resultEtablissementBancaire: IEtablissementBancaire | undefined;

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
    routingResolveService = TestBed.inject(EtablissementBancaireRoutingResolveService);
    service = TestBed.inject(EtablissementBancaireService);
    resultEtablissementBancaire = undefined;
  });

  describe('resolve', () => {
    it('should return IEtablissementBancaire returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtablissementBancaire = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtablissementBancaire).toEqual({ id: 123 });
    });

    it('should return new IEtablissementBancaire if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtablissementBancaire = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEtablissementBancaire).toEqual(new EtablissementBancaire());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EtablissementBancaire })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtablissementBancaire = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtablissementBancaire).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
