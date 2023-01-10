import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IHistoAugmentation, HistoAugmentation } from '../histo-augmentation.model';

import { HistoAugmentationService } from './histo-augmentation.service';

describe('HistoAugmentation Service', () => {
  let service: HistoAugmentationService;
  let httpMock: HttpTestingController;
  let elemDefault: IHistoAugmentation;
  let expectedResult: IHistoAugmentation | IHistoAugmentation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HistoAugmentationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      libelle: 'AAAAAAA',
      type: 'AAAAAAA',
      date: currentDate,
      categorie: 'AAAAAAA',
      hierarchie: 'AAAAAAA',
      plafond: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a HistoAugmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new HistoAugmentation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HistoAugmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          libelle: 'BBBBBB',
          type: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
          categorie: 'BBBBBB',
          hierarchie: 'BBBBBB',
          plafond: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HistoAugmentation', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
          libelle: 'BBBBBB',
          type: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
          categorie: 'BBBBBB',
        },
        new HistoAugmentation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HistoAugmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          libelle: 'BBBBBB',
          type: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
          categorie: 'BBBBBB',
          hierarchie: 'BBBBBB',
          plafond: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a HistoAugmentation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHistoAugmentationToCollectionIfMissing', () => {
      it('should add a HistoAugmentation to an empty array', () => {
        const histoAugmentation: IHistoAugmentation = { id: 123 };
        expectedResult = service.addHistoAugmentationToCollectionIfMissing([], histoAugmentation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(histoAugmentation);
      });

      it('should not add a HistoAugmentation to an array that contains it', () => {
        const histoAugmentation: IHistoAugmentation = { id: 123 };
        const histoAugmentationCollection: IHistoAugmentation[] = [
          {
            ...histoAugmentation,
          },
          { id: 456 },
        ];
        expectedResult = service.addHistoAugmentationToCollectionIfMissing(histoAugmentationCollection, histoAugmentation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HistoAugmentation to an array that doesn't contain it", () => {
        const histoAugmentation: IHistoAugmentation = { id: 123 };
        const histoAugmentationCollection: IHistoAugmentation[] = [{ id: 456 }];
        expectedResult = service.addHistoAugmentationToCollectionIfMissing(histoAugmentationCollection, histoAugmentation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(histoAugmentation);
      });

      it('should add only unique HistoAugmentation to an array', () => {
        const histoAugmentationArray: IHistoAugmentation[] = [{ id: 123 }, { id: 456 }, { id: 45780 }];
        const histoAugmentationCollection: IHistoAugmentation[] = [{ id: 123 }];
        expectedResult = service.addHistoAugmentationToCollectionIfMissing(histoAugmentationCollection, ...histoAugmentationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const histoAugmentation: IHistoAugmentation = { id: 123 };
        const histoAugmentation2: IHistoAugmentation = { id: 456 };
        expectedResult = service.addHistoAugmentationToCollectionIfMissing([], histoAugmentation, histoAugmentation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(histoAugmentation);
        expect(expectedResult).toContain(histoAugmentation2);
      });

      it('should accept null and undefined values', () => {
        const histoAugmentation: IHistoAugmentation = { id: 123 };
        expectedResult = service.addHistoAugmentationToCollectionIfMissing([], null, histoAugmentation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(histoAugmentation);
      });

      it('should return initial array if no HistoAugmentation is added', () => {
        const histoAugmentationCollection: IHistoAugmentation[] = [{ id: 123 }];
        expectedResult = service.addHistoAugmentationToCollectionIfMissing(histoAugmentationCollection, undefined, null);
        expect(expectedResult).toEqual(histoAugmentationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
