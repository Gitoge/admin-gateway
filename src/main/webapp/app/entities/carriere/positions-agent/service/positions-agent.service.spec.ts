import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPositionsAgent, PositionsAgent } from '../positions-agent.model';

import { PositionsAgentService } from './positions-agent.service';

describe('PositionsAgent Service', () => {
  let service: PositionsAgentService;
  let httpMock: HttpTestingController;
  let elemDefault: IPositionsAgent;
  let expectedResult: IPositionsAgent | IPositionsAgent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PositionsAgentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      motif: 'AAAAAAA',
      datePosition: currentDate,
      dateAnnulation: currentDate,
      dateFinAbsence: currentDate,
      status: 'AAAAAAA',
      posistionsId: 0,
      userInsertId: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          datePosition: currentDate.format(DATE_FORMAT),
          dateAnnulation: currentDate.format(DATE_FORMAT),
          dateFinAbsence: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PositionsAgent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          datePosition: currentDate.format(DATE_FORMAT),
          dateAnnulation: currentDate.format(DATE_FORMAT),
          dateFinAbsence: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          datePosition: currentDate,
          dateAnnulation: currentDate,
          dateFinAbsence: currentDate,
        },
        returnedFromService
      );

      service.create(new PositionsAgent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PositionsAgent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          motif: 'BBBBBB',
          datePosition: currentDate.format(DATE_FORMAT),
          dateAnnulation: currentDate.format(DATE_FORMAT),
          dateFinAbsence: currentDate.format(DATE_FORMAT),
          status: 'BBBBBB',
          posistionsId: 1,
          userInsertId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          datePosition: currentDate,
          dateAnnulation: currentDate,
          dateFinAbsence: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PositionsAgent', () => {
      const patchObject = Object.assign(
        {
          datePosition: currentDate.format(DATE_FORMAT),
          dateAnnulation: currentDate.format(DATE_FORMAT),
          dateFinAbsence: currentDate.format(DATE_FORMAT),
          posistionsId: 1,
        },
        new PositionsAgent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          datePosition: currentDate,
          dateAnnulation: currentDate,
          dateFinAbsence: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PositionsAgent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          motif: 'BBBBBB',
          datePosition: currentDate.format(DATE_FORMAT),
          dateAnnulation: currentDate.format(DATE_FORMAT),
          dateFinAbsence: currentDate.format(DATE_FORMAT),
          status: 'BBBBBB',
          posistionsId: 1,
          userInsertId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          datePosition: currentDate,
          dateAnnulation: currentDate,
          dateFinAbsence: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PositionsAgent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPositionsAgentToCollectionIfMissing', () => {
      it('should add a PositionsAgent to an empty array', () => {
        const positionsAgent: IPositionsAgent = { id: 123 };
        expectedResult = service.addPositionsAgentToCollectionIfMissing([], positionsAgent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(positionsAgent);
      });

      it('should not add a PositionsAgent to an array that contains it', () => {
        const positionsAgent: IPositionsAgent = { id: 123 };
        const positionsAgentCollection: IPositionsAgent[] = [
          {
            ...positionsAgent,
          },
          { id: 456 },
        ];
        expectedResult = service.addPositionsAgentToCollectionIfMissing(positionsAgentCollection, positionsAgent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PositionsAgent to an array that doesn't contain it", () => {
        const positionsAgent: IPositionsAgent = { id: 123 };
        const positionsAgentCollection: IPositionsAgent[] = [{ id: 456 }];
        expectedResult = service.addPositionsAgentToCollectionIfMissing(positionsAgentCollection, positionsAgent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(positionsAgent);
      });

      it('should add only unique PositionsAgent to an array', () => {
        const positionsAgentArray: IPositionsAgent[] = [{ id: 123 }, { id: 456 }, { id: 8211 }];
        const positionsAgentCollection: IPositionsAgent[] = [{ id: 123 }];
        expectedResult = service.addPositionsAgentToCollectionIfMissing(positionsAgentCollection, ...positionsAgentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const positionsAgent: IPositionsAgent = { id: 123 };
        const positionsAgent2: IPositionsAgent = { id: 456 };
        expectedResult = service.addPositionsAgentToCollectionIfMissing([], positionsAgent, positionsAgent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(positionsAgent);
        expect(expectedResult).toContain(positionsAgent2);
      });

      it('should accept null and undefined values', () => {
        const positionsAgent: IPositionsAgent = { id: 123 };
        expectedResult = service.addPositionsAgentToCollectionIfMissing([], null, positionsAgent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(positionsAgent);
      });

      it('should return initial array if no PositionsAgent is added', () => {
        const positionsAgentCollection: IPositionsAgent[] = [{ id: 123 }];
        expectedResult = service.addPositionsAgentToCollectionIfMissing(positionsAgentCollection, undefined, null);
        expect(expectedResult).toEqual(positionsAgentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
