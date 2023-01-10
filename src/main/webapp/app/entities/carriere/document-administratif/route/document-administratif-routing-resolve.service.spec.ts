jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDocumentAdministratif, DocumentAdministratif } from '../document-administratif.model';
import { DocumentAdministratifService } from '../service/document-administratif.service';

import { DocumentAdministratifRoutingResolveService } from './document-administratif-routing-resolve.service';

describe('Service Tests', () => {
  describe('DocumentAdministratif routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DocumentAdministratifRoutingResolveService;
    let service: DocumentAdministratifService;
    let resultDocumentAdministratif: IDocumentAdministratif | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DocumentAdministratifRoutingResolveService);
      service = TestBed.inject(DocumentAdministratifService);
      resultDocumentAdministratif = undefined;
    });

    describe('resolve', () => {
      it('should return IDocumentAdministratif returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDocumentAdministratif = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDocumentAdministratif).toEqual({ id: 123 });
      });

      it('should return new IDocumentAdministratif if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDocumentAdministratif = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDocumentAdministratif).toEqual(new DocumentAdministratif());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDocumentAdministratif = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDocumentAdministratif).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
