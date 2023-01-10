import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPosteCompoGrade, PosteCompoGrade } from '../poste-compo-grade.model';

import { PosteCompoGradeService } from './poste-compo-grade.service';

describe('PosteCompoGrade Service', () => {
  let service: PosteCompoGradeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPosteCompoGrade;
  let expectedResult: IPosteCompoGrade | IPosteCompoGrade[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PosteCompoGradeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dateInsert: currentDate,
      operateur: 'AAAAAAA',
      posteComposant: 'AAAAAAA',
      posteCompose: 'AAAAAAA',
      userInsertId: 0,
      valeur: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PosteCompoGrade', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new PosteCompoGrade()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PosteCompoGrade', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          operateur: 'BBBBBB',
          posteComposant: 'BBBBBB',
          posteCompose: 'BBBBBB',
          userInsertId: 1,
          valeur: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PosteCompoGrade', () => {
      const patchObject = Object.assign(
        {
          posteCompose: 'BBBBBB',
        },
        new PosteCompoGrade()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PosteCompoGrade', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          operateur: 'BBBBBB',
          posteComposant: 'BBBBBB',
          posteCompose: 'BBBBBB',
          userInsertId: 1,
          valeur: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PosteCompoGrade', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPosteCompoGradeToCollectionIfMissing', () => {
      it('should add a PosteCompoGrade to an empty array', () => {
        const posteCompoGrade: IPosteCompoGrade = { id: 123 };
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing([], posteCompoGrade);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(posteCompoGrade);
      });

      it('should not add a PosteCompoGrade to an array that contains it', () => {
        const posteCompoGrade: IPosteCompoGrade = { id: 123 };
        const posteCompoGradeCollection: IPosteCompoGrade[] = [
          {
            ...posteCompoGrade,
          },
          { id: 456 },
        ];
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing(posteCompoGradeCollection, posteCompoGrade);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PosteCompoGrade to an array that doesn't contain it", () => {
        const posteCompoGrade: IPosteCompoGrade = { id: 123 };
        const posteCompoGradeCollection: IPosteCompoGrade[] = [{ id: 456 }];
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing(posteCompoGradeCollection, posteCompoGrade);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(posteCompoGrade);
      });

      it('should add only unique PosteCompoGrade to an array', () => {
        const posteCompoGradeArray: IPosteCompoGrade[] = [{ id: 123 }, { id: 456 }, { id: 6964 }];
        const posteCompoGradeCollection: IPosteCompoGrade[] = [{ id: 123 }];
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing(posteCompoGradeCollection, ...posteCompoGradeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const posteCompoGrade: IPosteCompoGrade = { id: 123 };
        const posteCompoGrade2: IPosteCompoGrade = { id: 456 };
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing([], posteCompoGrade, posteCompoGrade2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(posteCompoGrade);
        expect(expectedResult).toContain(posteCompoGrade2);
      });

      it('should accept null and undefined values', () => {
        const posteCompoGrade: IPosteCompoGrade = { id: 123 };
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing([], null, posteCompoGrade, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(posteCompoGrade);
      });

      it('should return initial array if no PosteCompoGrade is added', () => {
        const posteCompoGradeCollection: IPosteCompoGrade[] = [{ id: 123 }];
        expectedResult = service.addPosteCompoGradeToCollectionIfMissing(posteCompoGradeCollection, undefined, null);
        expect(expectedResult).toEqual(posteCompoGradeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
