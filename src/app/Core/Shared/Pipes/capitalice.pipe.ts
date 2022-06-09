import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalice'
})
export class CapitalicePipe implements PipeTransform {

  transform(value: string): unknown {
    if (!value) return value;
    var palabras=value.split(' ')
    var result=''
    palabras.forEach(x=>{
      result+=x[0].toUpperCase() + x.slice(1).toLowerCase()+' ';
    })
    return result;
  }
}
