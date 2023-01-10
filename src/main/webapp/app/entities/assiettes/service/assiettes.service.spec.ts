import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAssiettes, Assiettes } from '../assiettes.model';

import { AssiettesService } from './assiettes.service';

describe('Assiettes Service', () => {
  let service: AssiettesService;
  let httpMock: HttpTestingController;
  let elemDefault: IAssiettes;
  let expectedResult: IAssiettes | IAssiettes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AssiettesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      userIdInsert: 0,
      userdateInsert: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Assiettes', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new Assiettes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Assiettes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Assiettes', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        new Assiettes()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Assiettes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Assiettes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAssiettesToCollectionIfMissing', () => {
      it('should add a Assiettes to an empty array', () => {
        const assiettes: IAssiettes = { id: 123 };
        expectedResult = service.addAssiettesToCollectionIfMissing([], assiettes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assiettes);
      });

      it('should not add a Assiettes to an array that contains it', () => {
        const assiettes: IAssiettes = { id: 123 };
        const assiettesCollection: IAssiettes[] = [
          {
            ...assiettes,
          },
          { id: 456 },
        ];
        expectedResult = service.addAssiettesToCollectionIfMissing(assiettesCollection, assiettes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Assiettes to an array that doesn't contain it", () => {
        const assiettes: IAssiettes = { id: 123 };
        const assiettesCollection: IAssiettes[] = [{ id: 456 }];
        expectedResult = service.addAssiettesToCollectionIfMissing(assiettesCollection, assiettes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assiettes);
      });

      it('should add only unique Assiettes to an array', () => {
        const assiettesArray: IAssiettes[] = [{ id: 123 }, { id: 456 }, { id: 91012 }];
        const assiettesCollection: IAssiettes[] = [{ id: 123 }];
        expectedResult = service.addAssiettesToCollectionIfMissing(assiettesCollection, ...assiettesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const assiettes: IAssiettes = { id: 123 };
        const assiettes2: IAssiettes = { id: 456 };
        expectedResult = service.addAssiettesToCollectionIfMissing([], assiettes, assiettes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assiettes);
        expect(expectedResult).toContain(assiettes2);
      });

      it('should accept null and undefined values', () => {
        const assiettes: IAssiettes = { id: 123 };
        expectedResult = service.addAssiettesToCollectionIfMissing([], null, assiettes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assiettes);
      });

      it('should return initial array if no Assiettes is added', () => {
        const assiettesCollection: IAssiettes[] = [{ id: 123 }];
        expectedResult = service.addAssiettesToCollectionIfMissing(assiettesCollection, undefined, null);
        expect(expectedResult).toEqual(assiettesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
