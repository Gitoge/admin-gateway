import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAvancement, Avancement } from '../avancement.model';

import { AvancementService } from './avancement.service';

describe('Avancement Service', () => {
  let service: AvancementService;
  let httpMock: HttpTestingController;
  let elemDefault: IAvancement;
  let expectedResult: IAvancement | IAvancement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AvancementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      gradeId: 0,
      echelonId: 0,
      hierarchieId: 0,
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

    it('should create a Avancement', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Avancement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Avancement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          gradeId: 1,
          echelonId: 1,
          hierarchieId: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Avancement', () => {
      const patchObject = Object.assign(
        {
          gradeId: 1,
          echelonId: 1,
        },
        new Avancement()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Avancement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          gradeId: 1,
          echelonId: 1,
          hierarchieId: 1,
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

    it('should delete a Avancement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAvancementToCollectionIfMissing', () => {
      it('should add a Avancement to an empty array', () => {
        const avancement: IAvancement = { id: 123 };
        expectedResult = service.addAvancementToCollectionIfMissing([], avancement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(avancement);
      });

      it('should not add a Avancement to an array that contains it', () => {
        const avancement: IAvancement = { id: 123 };
        const avancementCollection: IAvancement[] = [
          {
            ...avancement,
          },
          { id: 456 },
        ];
        expectedResult = service.addAvancementToCollectionIfMissing(avancementCollection, avancement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Avancement to an array that doesn't contain it", () => {
        const avancement: IAvancement = { id: 123 };
        const avancementCollection: IAvancement[] = [{ id: 456 }];
        expectedResult = service.addAvancementToCollectionIfMissing(avancementCollection, avancement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(avancement);
      });

      it('should add only unique Avancement to an array', () => {
        const avancementArray: IAvancement[] = [{ id: 123 }, { id: 456 }, { id: 6755 }];
        const avancementCollection: IAvancement[] = [{ id: 123 }];
        expectedResult = service.addAvancementToCollectionIfMissing(avancementCollection, ...avancementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const avancement: IAvancement = { id: 123 };
        const avancement2: IAvancement = { id: 456 };
        expectedResult = service.addAvancementToCollectionIfMissing([], avancement, avancement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(avancement);
        expect(expectedResult).toContain(avancement2);
      });

      it('should accept null and undefined values', () => {
        const avancement: IAvancement = { id: 123 };
        expectedResult = service.addAvancementToCollectionIfMissing([], null, avancement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(avancement);
      });

      it('should return initial array if no Avancement is added', () => {
        const avancementCollection: IAvancement[] = [{ id: 123 }];
        expectedResult = service.addAvancementToCollectionIfMissing(avancementCollection, undefined, null);
        expect(expectedResult).toEqual(avancementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
