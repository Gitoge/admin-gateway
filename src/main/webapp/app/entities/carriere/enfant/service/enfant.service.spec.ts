import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEnfant, Enfant } from '../enfant.model';

import { EnfantService } from './enfant.service';

describe('Enfant Service', () => {
  let service: EnfantService;
  let httpMock: HttpTestingController;
  let elemDefault: IEnfant;
  let expectedResult: IEnfant | IEnfant[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EnfantService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      matriculeParent: 'AAAAAAA',
      nom: 'AAAAAAA',
      prenom: 'AAAAAAA',
      sexe: 'AAAAAAA',
      dateNaissance: currentDate,
      lieuNaissance: 'AAAAAAA',
      numeroActeNaissance: 'AAAAAAA',
      dateActeNaissance: currentDate,
      rangEnfant: 0,
      codeAge: 0,
      enfantEnVie: false,
      enfantImposable: false,
      userInsertId: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateNaissance: currentDate.format(DATE_FORMAT),
          dateActeNaissance: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Enfant', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateNaissance: currentDate.format(DATE_FORMAT),
          dateActeNaissance: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          dateActeNaissance: currentDate,
        },
        returnedFromService
      );

      service.create(new Enfant()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Enfant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          matriculeParent: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          sexe: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_FORMAT),
          lieuNaissance: 'BBBBBB',
          numeroActeNaissance: 'BBBBBB',
          dateActeNaissance: currentDate.format(DATE_FORMAT),
          rangEnfant: 1,
          codeAge: 1,
          enfantEnVie: true,
          enfantImposable: true,
          userInsertId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          dateActeNaissance: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Enfant', () => {
      const patchObject = Object.assign(
        {
          dateNaissance: currentDate.format(DATE_FORMAT),
          lieuNaissance: 'BBBBBB',
          numeroActeNaissance: 'BBBBBB',
          dateActeNaissance: currentDate.format(DATE_FORMAT),
          rangEnfant: 1,
          enfantEnVie: true,
        },
        new Enfant()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          dateActeNaissance: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Enfant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          matriculeParent: 'BBBBBB',
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          sexe: 'BBBBBB',
          dateNaissance: currentDate.format(DATE_FORMAT),
          lieuNaissance: 'BBBBBB',
          numeroActeNaissance: 'BBBBBB',
          dateActeNaissance: currentDate.format(DATE_FORMAT),
          rangEnfant: 1,
          codeAge: 1,
          enfantEnVie: true,
          enfantImposable: true,
          userInsertId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateNaissance: currentDate,
          dateActeNaissance: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Enfant', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEnfantToCollectionIfMissing', () => {
      it('should add a Enfant to an empty array', () => {
        const enfant: IEnfant = { id: 123 };
        expectedResult = service.addEnfantToCollectionIfMissing([], enfant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enfant);
      });

      it('should not add a Enfant to an array that contains it', () => {
        const enfant: IEnfant = { id: 123 };
        const enfantCollection: IEnfant[] = [
          {
            ...enfant,
          },
          { id: 456 },
        ];
        expectedResult = service.addEnfantToCollectionIfMissing(enfantCollection, enfant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Enfant to an array that doesn't contain it", () => {
        const enfant: IEnfant = { id: 123 };
        const enfantCollection: IEnfant[] = [{ id: 456 }];
        expectedResult = service.addEnfantToCollectionIfMissing(enfantCollection, enfant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enfant);
      });

      it('should add only unique Enfant to an array', () => {
        const enfantArray: IEnfant[] = [{ id: 123 }, { id: 456 }, { id: 78746 }];
        const enfantCollection: IEnfant[] = [{ id: 123 }];
        expectedResult = service.addEnfantToCollectionIfMissing(enfantCollection, ...enfantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const enfant: IEnfant = { id: 123 };
        const enfant2: IEnfant = { id: 456 };
        expectedResult = service.addEnfantToCollectionIfMissing([], enfant, enfant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enfant);
        expect(expectedResult).toContain(enfant2);
      });

      it('should accept null and undefined values', () => {
        const enfant: IEnfant = { id: 123 };
        expectedResult = service.addEnfantToCollectionIfMissing([], null, enfant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enfant);
      });

      it('should return initial array if no Enfant is added', () => {
        const enfantCollection: IEnfant[] = [{ id: 123 }];
        expectedResult = service.addEnfantToCollectionIfMissing(enfantCollection, undefined, null);
        expect(expectedResult).toEqual(enfantCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
