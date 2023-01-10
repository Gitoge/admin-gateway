import dayjs from 'dayjs/esm';

export interface IExclusionAugmentation {
  id?: number;
  etablissementId?: number;
  posteId?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsertId?: dayjs.Dayjs | null;
  dateUpdateId?: dayjs.Dayjs | null;
}

export class ExclusionAugmentation implements IExclusionAugmentation {
  constructor(
    public id?: number,
    public etablissementId?: number,
    public posteId?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsertId?: dayjs.Dayjs | null,
    public dateUpdateId?: dayjs.Dayjs | null
  ) {}
}

export function getExclusionAugmentationIdentifier(exclusionAugmentation: IExclusionAugmentation): number | undefined {
  return exclusionAugmentation.id;
}
