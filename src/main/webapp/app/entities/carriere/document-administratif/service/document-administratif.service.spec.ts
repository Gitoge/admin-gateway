import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDocumentAdministratif, DocumentAdministratif } from '../document-administratif.model';

import { DocumentAdministratifService } from './document-administratif.service';

describe('Service Tests', () => {
  describe('DocumentAdministratif Service', () => {
    let service: DocumentAdministratifService;
    let httpMock: HttpTestingController;
    let elemDefault: IDocumentAdministratif;
    let expectedResult: IDocumentAdministratif | IDocumentAdministratif[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DocumentAdministratifService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateCreation: currentDate,
        proprietaireId: 0,
        nomDocument: 'AAAAAAA',
        typeEntite: 'AAAAAAA',
        typeDocument: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a DocumentAdministratif', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.create(new DocumentAdministratif()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a DocumentAdministratif', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
            proprietaireId: 1,
            nomDocument: 'BBBBBB',
            typeEntite: 'BBBBBB',
            typeDocument: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a DocumentAdministratif', () => {
        const patchObject = Object.assign(
          {
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
            proprietaireId: 1,
            typeEntite: 'BBBBBB',
          },
          new DocumentAdministratif()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of DocumentAdministratif', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
            proprietaireId: 1,
            nomDocument: 'BBBBBB',
            typeEntite: 'BBBBBB',
            typeDocument: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a DocumentAdministratif', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDocumentAdministratifToCollectionIfMissing', () => {
        it('should add a DocumentAdministratif to an empty array', () => {
          const documentAdministratif: IDocumentAdministratif = { id: 123 };
          expectedResult = service.addDocumentAdministratifToCollectionIfMissing([], documentAdministratif);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(documentAdministratif);
        });

        it('should not add a DocumentAdministratif to an array that contains it', () => {
          const documentAdministratif: IDocumentAdministratif = { id: 123 };
          const documentAdministratifCollection: IDocumentAdministratif[] = [
            {
              ...documentAdministratif,
            },
            { id: 456 },
          ];
          expectedResult = service.addDocumentAdministratifToCollectionIfMissing(documentAdministratifCollection, documentAdministratif);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a DocumentAdministratif to an array that doesn't contain it", () => {
          const documentAdministratif: IDocumentAdministratif = { id: 123 };
          const documentAdministratifCollection: IDocumentAdministratif[] = [{ id: 456 }];
          expectedResult = service.addDocumentAdministratifToCollectionIfMissing(documentAdministratifCollection, documentAdministratif);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(documentAdministratif);
        });

        it('should add only unique DocumentAdministratif to an array', () => {
          const documentAdministratifArray: IDocumentAdministratif[] = [{ id: 123 }, { id: 456 }, { id: 61428 }];
          const documentAdministratifCollection: IDocumentAdministratif[] = [{ id: 123 }];
          expectedResult = service.addDocumentAdministratifToCollectionIfMissing(
            documentAdministratifCollection,
            ...documentAdministratifArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const documentAdministratif: IDocumentAdministratif = { id: 123 };
          const documentAdministratif2: IDocumentAdministratif = { id: 456 };
          expectedResult = service.addDocumentAdministratifToCollectionIfMissing([], documentAdministratif, documentAdministratif2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(documentAdministratif);
          expect(expectedResult).toContain(documentAdministratif2);
        });

        it('should accept null and undefined values', () => {
          const documentAdministratif: IDocumentAdministratif = { id: 123 };
          expectedResult = service.addDocumentAdministratifToCollectionIfMissing([], null, documentAdministratif, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(documentAdministratif);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
