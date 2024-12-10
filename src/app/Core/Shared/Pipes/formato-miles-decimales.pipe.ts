import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoMilesDecimales'
})
export class FormatoMilesDecimalesPipe implements PipeTransform {

  transform(value: number | string): string {
    // Validar el valor de entrada
    const num = Number(value);
    if (isNaN(num)) {
      return '';
    }

    // Separar parte entera y decimal con dos decimales
    const parts = num.toFixed(2).split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Agregar separadores de miles
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combinar parte entera y decimal
    return `${integerPart}.${decimalPart}`;
  }

}
