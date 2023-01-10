import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmoluments, Emoluments } from '../emoluments.model';

import { EmolumentsService } from './emoluments.service';

describe('Emoluments Service', () => {
  let service: EmolumentsService;
  let httpMock: HttpTestingController;
  let elemDefault: IEmoluments;
  let expectedResult: IEmoluments | IEmoluments[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmolumentsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      matricule: 'AAAAAAA',
      reference: 'AAAAAAA',
      montant: 0,
      taux: 0,
      dateEffet: currentDate,
      dateEcheance: currentDate,
      agentId: 0,
      etablissementId: 0,
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
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
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

    it('should create a Emoluments', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new Emoluments()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Emoluments', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          agentId: 1,
          etablissementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
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

    it('should partial update a Emoluments', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          dateEcheance: currentDate.format(DATE_FORMAT),
          userInsertId: 1,
          userUpdateId: 1,
        },
        new Emoluments()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
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

    it('should return a list of Emoluments', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          agentId: 1,
          etablissementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
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

    it('should delete a Emoluments', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmolumentsToCollectionIfMissing', () => {
      it('should add a Emoluments to an empty array', () => {
        const emoluments: IEmoluments = { id: 123 };
        expectedResult = service.addEmolumentsToCollectionIfMissing([], emoluments);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emoluments);
      });

      it('should not add a Emoluments to an array that contains it', () => {
        const emoluments: IEmoluments = { id: 123 };
        const emolumentsCollection: IEmoluments[] = [
          {
            ...emoluments,
          },
          { id: 456 },
        ];
        expectedResult = service.addEmolumentsToCollectionIfMissing(emolumentsCollection, emoluments);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Emoluments to an array that doesn't contain it", () => {
        const emoluments: IEmoluments = { id: 123 };
        const emolumentsCollection: IEmoluments[] = [{ id: 456 }];
        expectedResult = service.addEmolumentsToCollectionIfMissing(emolumentsCollection, emoluments);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emoluments);
      });

      it('should add only unique Emoluments to an array', () => {
        const emolumentsArray: IEmoluments[] = [{ id: 123 }, { id: 456 }, { id: 54481 }];
        const emolumentsCollection: IEmoluments[] = [{ id: 123 }];
        expectedResult = service.addEmolumentsToCollectionIfMissing(emolumentsCollection, ...emolumentsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emoluments: IEmoluments = { id: 123 };
        const emoluments2: IEmoluments = { id: 456 };
        expectedResult = service.addEmolumentsToCollectionIfMissing([], emoluments, emoluments2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emoluments);
        expect(expectedResult).toContain(emoluments2);
      });

      it('should accept null and undefined values', () => {
        const emoluments: IEmoluments = { id: 123 };
        expectedResult = service.addEmolumentsToCollectionIfMissing([], null, emoluments, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emoluments);
      });

      it('should return initial array if no Emoluments is added', () => {
        const emolumentsCollection: IEmoluments[] = [{ id: 123 }];
        expectedResult = service.addEmolumentsToCollectionIfMissing(emolumentsCollection, undefined, null);
        expect(expectedResult).toEqual(emolumentsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
