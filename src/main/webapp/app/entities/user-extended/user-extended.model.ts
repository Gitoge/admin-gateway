export interface IUserExtended {
  id?: number;
}

export class UserExtended implements IUserExtended {
  constructor(public id?: number) {}
}

export function getUserExtendedIdentifier(userExtended: IUserExtended): number | undefined {
  return userExtended.id;
}
