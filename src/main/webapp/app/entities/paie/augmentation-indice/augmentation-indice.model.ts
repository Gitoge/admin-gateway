import { IPostes } from '../../postes/postes.model';
import { IHistoAugmentation } from '../histo-augmentation/histo-augmentation.model';

export interface IAugmentationIndice {
  id?: number;
  libelle?: string;
  valeur?: number | null;
  idPoste?: number | null;
  codePoste?: string | null;
  postes?: IPostes;
  histoAugmentation?: IHistoAugmentation;
  total?: number | null;
}

export class AugmentationIndice implements IAugmentationIndice {
  constructor(
    public id?: number,
    public libelle?: string,
    public valeur?: number | null,
    public idPoste?: number | null,
    public codePoste?: string | null,
    public postes?: IPostes,
    public histoAugmentation?: IHistoAugmentation,
    public total?: number | null
  ) {}
}

export function getAugmentationIndiceIdentifier(augmentationIndice: IAugmentationIndice): number | undefined {
  return augmentationIndice.id;
}
