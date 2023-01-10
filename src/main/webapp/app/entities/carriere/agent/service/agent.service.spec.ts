import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAgent, Agent } from '../agent.model';

import { AgentService } from './agent.service';

describe('Agent Service', () => {
  let service: AgentService;
  let httpMock: HttpTestingController;
  let elemDefault: IAgent;
  let expectedResult: IAgent | IAgent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AgentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      matricule: 'AAAAAAA',

      prenom: 'AAAAAAA',
      nom: 'AAAAAAA',
      dateNaissance: currentDate,
      lieuNaissance: 'AAAAAAA',
      sexe: 'AAAAAAA',
      nomMari: 'AAAAAAA',
      telephone: 'AAAAAAA',
      email: 'AAAAAAA',
      adresse: 'AAAAAAA',
      femmeMariee: false,
      datePriseEnCharge: currentDate,
      dateSortie: currentDate,
      status: 'AAAAAAA',
      titre: '',
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
          dateNaissance: currentDate.format(DATE_FORMAT),
          datePriseEnCharge: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
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

    it('should create a Agent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateNaissance: currentDate.format(DATE_FORMAT),
          datePriseEnCharge: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          datePriseEnCharge: currentDate,
          dateSortie: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new Agent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Agent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          matricule: 'BBBBBB',
          nin: 'BBBBBB',
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_FORMAT),
          lieuNaissance: 'BBBBBB',
          sexe: 'BBBBBB',
          nomMari: 'BBBBBB',
          telephone: 'BBBBBB',
          email: 'BBBBBB',
          adresse: 'BBBBBB',
          femmeMariee: true,
          datePriseEnCharge: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          titre: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          datePriseEnCharge: currentDate,
          dateSortie: currentDate,
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

    it('should partial update a Agent', () => {
      const patchObject = Object.assign(
        {
          nin: 'BBBBBB',
          prenom: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_FORMAT),
          lieuNaissance: 'BBBBBB',
          sexe: 'BBBBBB',
          nomMari: 'BBBBBB',
          femmeMariee: true,
          status: 'BBBBBB',
          userInsertId: 1,
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Agent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          datePriseEnCharge: currentDate,
          dateSortie: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      // service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Agent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          matricule: 'BBBBBB',
          nin: 'BBBBBB',
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_FORMAT),
          lieuNaissance: 'BBBBBB',
          sexe: 'BBBBBB',
          nomMari: 'BBBBBB',
          telephone: 'BBBBBB',
          email: 'BBBBBB',
          adresse: 'BBBBBB',
          femmeMariee: true,
          datePriseEnCharge: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          titre: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          datePriseEnCharge: currentDate,
          dateSortie: currentDate,
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

    it('should delete a Agent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAgentToCollectionIfMissing', () => {
      it('should add a Agent to an empty array', () => {
        const agent: IAgent = { id: 123 };
        expectedResult = service.addAgentToCollectionIfMissing([], agent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agent);
      });

      it('should not add a Agent to an array that contains it', () => {
        const agent: IAgent = { id: 123 };
        const agentCollection: IAgent[] = [
          {
            ...agent,
          },
          { id: 456 },
        ];
        expectedResult = service.addAgentToCollectionIfMissing(agentCollection, agent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Agent to an array that doesn't contain it", () => {
        const agent: IAgent = { id: 123 };
        const agentCollection: IAgent[] = [{ id: 456 }];
        expectedResult = service.addAgentToCollectionIfMissing(agentCollection, agent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agent);
      });

      it('should add only unique Agent to an array', () => {
        const agentArray: IAgent[] = [{ id: 123 }, { id: 456 }, { id: 60432 }];
        const agentCollection: IAgent[] = [{ id: 123 }];
        expectedResult = service.addAgentToCollectionIfMissing(agentCollection, ...agentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const agent: IAgent = { id: 123 };
        const agent2: IAgent = { id: 456 };
        expectedResult = service.addAgentToCollectionIfMissing([], agent, agent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agent);
        expect(expectedResult).toContain(agent2);
      });

      it('should accept null and undefined values', () => {
        const agent: IAgent = { id: 123 };
        expectedResult = service.addAgentToCollectionIfMissing([], null, agent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agent);
      });

      it('should return initial array if no Agent is added', () => {
        const agentCollection: IAgent[] = [{ id: 123 }];
        expectedResult = service.addAgentToCollectionIfMissing(agentCollection, undefined, null);
        expect(expectedResult).toEqual(agentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
