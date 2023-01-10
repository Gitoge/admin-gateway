import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmplois, Emplois } from '../emplois.model';

import { EmploisService } from './emplois.service';

describe('Emplois Service', () => {
  let service: EmploisService;
  let httpMock: HttpTestingController;
  let elemDefault: IEmplois;
  let expectedResult: IEmplois | IEmplois[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmploisService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      tauxAt: 0,
      primeLieEmploi: 'AAAAAAA',
      indemniteLogement: 'AAAAAAA',
      indemnitesujetion: 'AAAAAAA',
      indemnitehabillement: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Emplois', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Emplois()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Emplois', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          tauxAt: 1,
          primeLieEmploi: 'BBBBBB',
          indemniteLogement: 'BBBBBB',
          indemnitesujetion: 'BBBBBB',
          indemnitehabillement: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Emplois', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          tauxAt: 1,
          indemnitesujetion: 'BBBBBB',
        },
        new Emplois()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Emplois', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          tauxAt: 1,
          primeLieEmploi: 'BBBBBB',
          indemniteLogement: 'BBBBBB',
          indemnitesujetion: 'BBBBBB',
          indemnitehabillement: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Emplois', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmploisToCollectionIfMissing', () => {
      it('should add a Emplois to an empty array', () => {
        const emplois: IEmplois = { id: 123 };
        expectedResult = service.addEmploisToCollectionIfMissing([], emplois);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emplois);
      });

      it('should not add a Emplois to an array that contains it', () => {
        const emplois: IEmplois = { id: 123 };
        const emploisCollection: IEmplois[] = [
          {
            ...emplois,
          },
          { id: 456 },
        ];
        expectedResult = service.addEmploisToCollectionIfMissing(emploisCollection, emplois);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Emplois to an array that doesn't contain it", () => {
        const emplois: IEmplois = { id: 123 };
        const emploisCollection: IEmplois[] = [{ id: 456 }];
        expectedResult = service.addEmploisToCollectionIfMissing(emploisCollection, emplois);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emplois);
      });

      it('should add only unique Emplois to an array', () => {
        const emploisArray: IEmplois[] = [{ id: 123 }, { id: 456 }, { id: 72852 }];
        const emploisCollection: IEmplois[] = [{ id: 123 }];
        expectedResult = service.addEmploisToCollectionIfMissing(emploisCollection, ...emploisArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emplois: IEmplois = { id: 123 };
        const emplois2: IEmplois = { id: 456 };
        expectedResult = service.addEmploisToCollectionIfMissing([], emplois, emplois2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emplois);
        expect(expectedResult).toContain(emplois2);
      });

      it('should accept null and undefined values', () => {
        const emplois: IEmplois = { id: 123 };
        expectedResult = service.addEmploisToCollectionIfMissing([], null, emplois, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emplois);
      });

      it('should return initial array if no Emplois is added', () => {
        const emploisCollection: IEmplois[] = [{ id: 123 }];
        expectedResult = service.addEmploisToCollectionIfMissing(emploisCollection, undefined, null);
        expect(expectedResult).toEqual(emploisCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
