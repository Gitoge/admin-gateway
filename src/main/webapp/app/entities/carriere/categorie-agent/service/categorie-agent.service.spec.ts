import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICategorieAgent, CategorieAgent } from '../categorie-agent.model';

import { CategorieAgentService } from './categorie-agent.service';

describe('CategorieAgent Service', () => {
  let service: CategorieAgentService;
  let httpMock: HttpTestingController;
  let elemDefault: ICategorieAgent;
  let expectedResult: ICategorieAgent | ICategorieAgent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CategorieAgentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      userInsertId: 0,
      userUpdateId: 0,
      dateInsert: currentDate,
      dateUpdate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CategorieAgent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new CategorieAgent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CategorieAgent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CategorieAgent', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
        },
        new CategorieAgent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CategorieAgent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CategorieAgent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCategorieAgentToCollectionIfMissing', () => {
      it('should add a CategorieAgent to an empty array', () => {
        const categorieAgent: ICategorieAgent = { id: 123 };
        expectedResult = service.addCategorieAgentToCollectionIfMissing([], categorieAgent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categorieAgent);
      });

      it('should not add a CategorieAgent to an array that contains it', () => {
        const categorieAgent: ICategorieAgent = { id: 123 };
        const categorieAgentCollection: ICategorieAgent[] = [
          {
            ...categorieAgent,
          },
          { id: 456 },
        ];
        expectedResult = service.addCategorieAgentToCollectionIfMissing(categorieAgentCollection, categorieAgent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CategorieAgent to an array that doesn't contain it", () => {
        const categorieAgent: ICategorieAgent = { id: 123 };
        const categorieAgentCollection: ICategorieAgent[] = [{ id: 456 }];
        expectedResult = service.addCategorieAgentToCollectionIfMissing(categorieAgentCollection, categorieAgent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categorieAgent);
      });

      it('should add only unique CategorieAgent to an array', () => {
        const categorieAgentArray: ICategorieAgent[] = [{ id: 123 }, { id: 456 }, { id: 49593 }];
        const categorieAgentCollection: ICategorieAgent[] = [{ id: 123 }];
        expectedResult = service.addCategorieAgentToCollectionIfMissing(categorieAgentCollection, ...categorieAgentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const categorieAgent: ICategorieAgent = { id: 123 };
        const categorieAgent2: ICategorieAgent = { id: 456 };
        expectedResult = service.addCategorieAgentToCollectionIfMissing([], categorieAgent, categorieAgent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categorieAgent);
        expect(expectedResult).toContain(categorieAgent2);
      });

      it('should accept null and undefined values', () => {
        const categorieAgent: ICategorieAgent = { id: 123 };
        expectedResult = service.addCategorieAgentToCollectionIfMissing([], null, categorieAgent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categorieAgent);
      });

      it('should return initial array if no CategorieAgent is added', () => {
        const categorieAgentCollection: ICategorieAgent[] = [{ id: 123 }];
        expectedResult = service.addCategorieAgentToCollectionIfMissing(categorieAgentCollection, undefined, null);
        expect(expectedResult).toEqual(categorieAgentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
