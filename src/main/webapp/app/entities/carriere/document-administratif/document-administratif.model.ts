import * as dayjs from 'dayjs';
import { INatureActes } from '../nature-actes/nature-actes.model';
import { IEvenement } from '../evenement/evenement.model';
import { ITypeActes } from '../type-actes/type-actes.model';

export interface IDocumentAdministratif {
  id?: number;
  dateCreation?: dayjs.Dayjs | null;
  proprietaireId?: number;
  nomDocument?: string;
  typeEntite?: string | null;
  typeDocument?: string | null;
  fichierContentType?: string | null;
  fichier?: string | null;
  numero?: string | null;
  date?: any;
  natureActe?: INatureActes;
  evenement?: IEvenement | null;
  matricule?: string | null;
  typeActes?: ITypeActes | null;
}

export class DocumentAdministratif implements IDocumentAdministratif {
  constructor(
    public id?: number,
    public dateCreation?: dayjs.Dayjs | null,
    public proprietaireId?: number,
    public nomDocument?: string,
    public typeEntite?: string | null,
    public typeDocument?: string | null,
    public fichierContentType?: string | null,
    public fichier?: string | null,
    public numero?: string | null,
    public date?: any,
    public natureActe?: INatureActes,
    public evenement?: IEvenement | null,
    public matricule?: string | null,
    public typeActes?: ITypeActes | null
  ) {}
}

export function getDocumentAdministratifIdentifier(documentAdministratif: IDocumentAdministratif): number | undefined {
  return documentAdministratif.id;
}
