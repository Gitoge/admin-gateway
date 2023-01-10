export interface IUserInfos {
  id?: number;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  activated?: boolean;
  idStructureAdmin?: number;
  codeStructureAdmin?: string;
  libelleStructureAdmin?: string;
  idRole?: number;
  codeRole?: string;
  libelleRole?: string;
  idProfil?: number;
  codeProfil?: string;
  libelleProfil?: string;
  idApplication?: number;
  codeApplication?: string;
  libelleApplication?: string;
  idPages?: number;
  codePages?: string;
  libellePages?: string;
  personneId?: number;
}

export class UserInfos implements IUserInfos {
  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public imageUrl?: string,
    public activated?: boolean,
    public idStructureAdmin?: number,
    public codeStructureAdmin?: string,
    public libelleStructureAdmin?: string,
    public idRole?: number,
    public codeRole?: string,
    public libelleRole?: string,
    public idProfil?: number,
    public codeProfil?: string,
    public libelleProfil?: string,
    public idApplication?: number,
    public codeApplication?: string,
    public libelleApplication?: string,
    public idPages?: number,
    public codePages?: string,
    public libellePages?: string,
    public personneId?: number
  ) {}
}
