

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function MovilValidator(IdPais: number): any{
  return (control: AbstractControl)=>{
    const valor=<string>control.value;
    var Paises=[51,52,57,591,56]
    var error=false
    if(Paises.find(element => element ==IdPais)){
      if(!valor) return;
      if(valor.length===0)return;
      var numbers=valor.split('');
      if(IdPais==51 || IdPais==56){
        if(numbers[0].toString()!='9')error=true;
      }
      if(IdPais==57){
        if(numbers[0].toString()!='3')error=true;
      }
      if(IdPais==591){
        if(numbers[0].toString()!='7' && numbers[0]!='6')error=true;
      }


      var actual='1';
      var contador=1
      for (let index = 0; index < numbers.length; index++) {
        if(contador<5){
          if(actual!=numbers[index]){
            actual=numbers[index]
            contador=0
          }else{
            contador++
          }
        }else{
          error=true
          break;
        }
      }
      console.log(IdPais)
      if(error==true){
        return{
          MovilValidator:{
            mensaje:'El numero telefonico es incorrecto'
          }
        }
      }
    }
    return ;

  }
}
