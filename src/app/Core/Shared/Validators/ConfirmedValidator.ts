import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ConfirmedValidator(matching: string): any{
  return (control: AbstractControl)=>{
    const valor=<string>control.value;
    if(!valor) return;
    if(valor.length===0)return;
    if(valor !== matching){
      return{
        ConfirmedValidator:{
          mensaje:'El valor no coincide'
        }
      }
    }
    return;
  }
}
