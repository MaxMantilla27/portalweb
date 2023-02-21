export interface login
{
  Email:string;
  Password:string;
  Recordar:boolean,
}
export interface loginSendDTO
{
  username:string;
  password:string;
}

export interface loginSendFacebookDTO
{
  Email:string;
  IdFacebook:string;
  Token:string;
  DataFacebook:string;
  msj:string
}
