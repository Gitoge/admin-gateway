import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICadre, Cadre } from '../cadre.model';

import { CadreService } from './cadre.service';

describe('Cadre Service', () => {
  let service: CadreService;
  let httpMock: HttpTestingController;
  let elemDefault: ICadre;
  let expectedResult: ICadre | ICadre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CadreService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      typeSalaire: 'AAAAAAA',
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

    it('should create a Cadre', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Cadre()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cadre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          typeSalaire: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cadre', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Cadre()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cadre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          typeSalaire: 'BBBBBB',
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

    it('should delete a Cadre', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCadreToCollectionIfMissing', () => {
      it('should add a Cadre to an empty array', () => {
        const cadre: ICadre = { id: 123 };
        expectedResult = service.addCadreToCollectionIfMissing([], cadre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cadre);
      });

      it('should not add a Cadre to an array that contains it', () => {
        const cadre: ICadre = { id: 123 };
        const cadreCollection: ICadre[] = [
          {
            ...cadre,
          },
          { id: 456 },
        ];
        expectedResult = service.addCadreToCollectionIfMissing(cadreCollection, cadre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cadre to an array that doesn't contain it", () => {
        const cadre: ICadre = { id: 123 };
        const cadreCollection: ICadre[] = [{ id: 456 }];
        expectedResult = service.addCadreToCollectionIfMissing(cadreCollection, cadre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cadre);
      });

      it('should add only unique Cadre to an array', () => {
        const cadreArray: ICadre[] = [{ id: 123 }, { id: 456 }, { id: 84154 }];
        const cadreCollection: ICadre[] = [{ id: 123 }];
        expectedResult = service.addCadreToCollectionIfMissing(cadreCollection, ...cadreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cadre: ICadre = { id: 123 };
        const cadre2: ICadre = { id: 456 };
        expectedResult = service.addCadreToCollectionIfMissing([], cadre, cadre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cadre);
        expect(expectedResult).toContain(cadre2);
      });

      it('should accept null and undefined values', () => {
        const cadre: ICadre = { id: 123 };
        expectedResult = service.addCadreToCollectionIfMissing([], null, cadre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cadre);
      });

      it('should return initial array if no Cadre is added', () => {
        const cadreCollection: ICadre[] = [{ id: 123 }];
        expectedResult = service.addCadreToCollectionIfMissing(cadreCollection, undefined, null);
        expect(expectedResult).toEqual(cadreCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
