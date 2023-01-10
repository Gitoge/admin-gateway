import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDiplomes, Diplomes } from '../diplomes.model';

import { DiplomesService } from './diplomes.service';

describe('Diplomes Service', () => {
  let service: DiplomesService;
  let httpMock: HttpTestingController;
  let elemDefault: IDiplomes;
  let expectedResult: IDiplomes | IDiplomes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DiplomesService);
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

    it('should create a Diplomes', () => {
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

      service.create(new Diplomes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Diplomes', () => {
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

    it('should partial update a Diplomes', () => {
      const patchObject = Object.assign({}, new Diplomes());

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

    it('should return a list of Diplomes', () => {
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

    it('should delete a Diplomes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDiplomesToCollectionIfMissing', () => {
      it('should add a Diplomes to an empty array', () => {
        const diplomes: IDiplomes = { id: 123 };
        expectedResult = service.addDiplomesToCollectionIfMissing([], diplomes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diplomes);
      });

      it('should not add a Diplomes to an array that contains it', () => {
        const diplomes: IDiplomes = { id: 123 };
        const diplomesCollection: IDiplomes[] = [
          {
            ...diplomes,
          },
          { id: 456 },
        ];
        expectedResult = service.addDiplomesToCollectionIfMissing(diplomesCollection, diplomes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Diplomes to an array that doesn't contain it", () => {
        const diplomes: IDiplomes = { id: 123 };
        const diplomesCollection: IDiplomes[] = [{ id: 456 }];
        expectedResult = service.addDiplomesToCollectionIfMissing(diplomesCollection, diplomes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diplomes);
      });

      it('should add only unique Diplomes to an array', () => {
        const diplomesArray: IDiplomes[] = [{ id: 123 }, { id: 456 }, { id: 41083 }];
        const diplomesCollection: IDiplomes[] = [{ id: 123 }];
        expectedResult = service.addDiplomesToCollectionIfMissing(diplomesCollection, ...diplomesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const diplomes: IDiplomes = { id: 123 };
        const diplomes2: IDiplomes = { id: 456 };
        expectedResult = service.addDiplomesToCollectionIfMissing([], diplomes, diplomes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diplomes);
        expect(expectedResult).toContain(diplomes2);
      });

      it('should accept null and undefined values', () => {
        const diplomes: IDiplomes = { id: 123 };
        expectedResult = service.addDiplomesToCollectionIfMissing([], null, diplomes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diplomes);
      });

      it('should return initial array if no Diplomes is added', () => {
        const diplomesCollection: IDiplomes[] = [{ id: 123 }];
        expectedResult = service.addDiplomesToCollectionIfMissing(diplomesCollection, undefined, null);
        expect(expectedResult).toEqual(diplomesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
