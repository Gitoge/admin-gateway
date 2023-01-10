import dayjs from 'dayjs/esm';

export interface IAugmentationHierarchie {
  id?: number;
  montant?: number;
  augmentationId?: number;
  hierarchieId?: number;
  userInserId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
}

export class AugmentationHierarchie implements IAugmentationHierarchie {
  constructor(
    public id?: number,
    public montant?: number,
    public augmentationId?: number,
    public hierarchieId?: number,
    public userInserId?: number | null,
    public dateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getAugmentationHierarchieIdentifier(augmentationHierarchie: IAugmentationHierarchie): number | undefined {
  return augmentationHierarchie.id;
}
