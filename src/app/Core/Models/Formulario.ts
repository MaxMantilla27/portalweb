import { Validator, Validators } from "@angular/forms";
import { Basic } from "./BasicDTO";

export interface formulario
{
  nombre:string;
  validate:Array<Validators>;
  valorInicial:any;
  tipo:string;
  label:string;
  style?:string;
  data?:Array<Basic>,
  disable?:boolean,
  class?:string,
  focus?:boolean,
  error?:string
}
