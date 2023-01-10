import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFichePaie, FichePaie } from '../fiche-paie.model';

import { FichePaieService } from './fiche-paie.service';

describe('FichePaie Service', () => {
  let service: FichePaieService;
  let httpMock: HttpTestingController;
  let elemDefault: IFichePaie;
  let expectedResult: IFichePaie | IFichePaie[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FichePaieService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      libellePoste: 'AAAAAAA',
      matricule: 'AAAAAAA',
      montantGain: 0,
      montantRetenue: 0,
      dateCalcul: currentDate,
      dateAnnulationCalcul: currentDate,
      annulationCalcul: false,
      agentId: 0,
      posteId: 0,
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
          dateCalcul: currentDate.format(DATE_FORMAT),
          dateAnnulationCalcul: currentDate.format(DATE_FORMAT),
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

    it('should create a FichePaie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateCalcul: currentDate.format(DATE_FORMAT),
          dateAnnulationCalcul: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateCalcul: currentDate,
          dateAnnulationCalcul: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new FichePaie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FichePaie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          libellePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          montantGain: 1,
          montantRetenue: 1,
          dateCalcul: currentDate.format(DATE_FORMAT),
          dateAnnulationCalcul: currentDate.format(DATE_FORMAT),
          annulationCalcul: true,
          agentId: 1,
          posteId: 1,
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
          dateCalcul: currentDate,
          dateAnnulationCalcul: currentDate,
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

    it('should partial update a FichePaie', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
          montantRetenue: 1,
          dateCalcul: currentDate.format(DATE_FORMAT),
          dateAnnulationCalcul: currentDate.format(DATE_FORMAT),
          posteId: 1,
          etablissementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new FichePaie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateCalcul: currentDate,
          dateAnnulationCalcul: currentDate,
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

    it('should return a list of FichePaie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          libellePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          montantGain: 1,
          montantRetenue: 1,
          dateCalcul: currentDate.format(DATE_FORMAT),
          dateAnnulationCalcul: currentDate.format(DATE_FORMAT),
          annulationCalcul: true,
          agentId: 1,
          posteId: 1,
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
          dateCalcul: currentDate,
          dateAnnulationCalcul: currentDate,
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

    it('should delete a FichePaie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFichePaieToCollectionIfMissing', () => {
      it('should add a FichePaie to an empty array', () => {
        const fichePaie: IFichePaie = { id: 123 };
        expectedResult = service.addFichePaieToCollectionIfMissing([], fichePaie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fichePaie);
      });

      it('should not add a FichePaie to an array that contains it', () => {
        const fichePaie: IFichePaie = { id: 123 };
        const fichePaieCollection: IFichePaie[] = [
          {
            ...fichePaie,
          },
          { id: 456 },
        ];
        expectedResult = service.addFichePaieToCollectionIfMissing(fichePaieCollection, fichePaie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FichePaie to an array that doesn't contain it", () => {
        const fichePaie: IFichePaie = { id: 123 };
        const fichePaieCollection: IFichePaie[] = [{ id: 456 }];
        expectedResult = service.addFichePaieToCollectionIfMissing(fichePaieCollection, fichePaie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fichePaie);
      });

      it('should add only unique FichePaie to an array', () => {
        const fichePaieArray: IFichePaie[] = [{ id: 123 }, { id: 456 }, { id: 74016 }];
        const fichePaieCollection: IFichePaie[] = [{ id: 123 }];
        expectedResult = service.addFichePaieToCollectionIfMissing(fichePaieCollection, ...fichePaieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fichePaie: IFichePaie = { id: 123 };
        const fichePaie2: IFichePaie = { id: 456 };
        expectedResult = service.addFichePaieToCollectionIfMissing([], fichePaie, fichePaie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fichePaie);
        expect(expectedResult).toContain(fichePaie2);
      });

      it('should accept null and undefined values', () => {
        const fichePaie: IFichePaie = { id: 123 };
        expectedResult = service.addFichePaieToCollectionIfMissing([], null, fichePaie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fichePaie);
      });

      it('should return initial array if no FichePaie is added', () => {
        const fichePaieCollection: IFichePaie[] = [{ id: 123 }];
        expectedResult = service.addFichePaieToCollectionIfMissing(fichePaieCollection, undefined, null);
        expect(expectedResult).toEqual(fichePaieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
