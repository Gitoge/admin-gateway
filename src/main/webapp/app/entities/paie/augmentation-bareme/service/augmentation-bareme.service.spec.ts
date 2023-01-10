import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAugmentationBareme, AugmentationBareme } from '../augmentation-bareme.model';

import { AugmentationBaremeService } from './augmentation-bareme.service';

describe('AugmentationBareme Service', () => {
  let service: AugmentationBaremeService;
  let httpMock: HttpTestingController;
  let elemDefault: IAugmentationBareme;
  let expectedResult: IAugmentationBareme | IAugmentationBareme[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AugmentationBaremeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      montant: 0,
      posteId: 0,
      dateInsertId: currentDate,
      dateUpdateId: currentDate,
      userInsertId: 0,
      userUpdateId: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a AugmentationBareme', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.create(new AugmentationBareme()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AugmentationBareme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          montant: 1,
          posteId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
          userInsertId: 1,
          userUpdateId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AugmentationBareme', () => {
      const patchObject = Object.assign(
        {
          montant: 1,
          posteId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          userUpdateId: 1,
        },
        new AugmentationBareme()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AugmentationBareme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          montant: 1,
          posteId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
          userInsertId: 1,
          userUpdateId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a AugmentationBareme', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAugmentationBaremeToCollectionIfMissing', () => {
      it('should add a AugmentationBareme to an empty array', () => {
        const augmentationBareme: IAugmentationBareme = { id: 123 };
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing([], augmentationBareme);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentationBareme);
      });

      it('should not add a AugmentationBareme to an array that contains it', () => {
        const augmentationBareme: IAugmentationBareme = { id: 123 };
        const augmentationBaremeCollection: IAugmentationBareme[] = [
          {
            ...augmentationBareme,
          },
          { id: 456 },
        ];
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing(augmentationBaremeCollection, augmentationBareme);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AugmentationBareme to an array that doesn't contain it", () => {
        const augmentationBareme: IAugmentationBareme = { id: 123 };
        const augmentationBaremeCollection: IAugmentationBareme[] = [{ id: 456 }];
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing(augmentationBaremeCollection, augmentationBareme);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentationBareme);
      });

      it('should add only unique AugmentationBareme to an array', () => {
        const augmentationBaremeArray: IAugmentationBareme[] = [{ id: 123 }, { id: 456 }, { id: 43072 }];
        const augmentationBaremeCollection: IAugmentationBareme[] = [{ id: 123 }];
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing(augmentationBaremeCollection, ...augmentationBaremeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const augmentationBareme: IAugmentationBareme = { id: 123 };
        const augmentationBareme2: IAugmentationBareme = { id: 456 };
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing([], augmentationBareme, augmentationBareme2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentationBareme);
        expect(expectedResult).toContain(augmentationBareme2);
      });

      it('should accept null and undefined values', () => {
        const augmentationBareme: IAugmentationBareme = { id: 123 };
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing([], null, augmentationBareme, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentationBareme);
      });

      it('should return initial array if no AugmentationBareme is added', () => {
        const augmentationBaremeCollection: IAugmentationBareme[] = [{ id: 123 }];
        expectedResult = service.addAugmentationBaremeToCollectionIfMissing(augmentationBaremeCollection, undefined, null);
        expect(expectedResult).toEqual(augmentationBaremeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
