import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removePuntoComa'
})
export class RemovePuntoComaPipe implements PipeTransform {

  transform(value: string): string {
    if (value === null || value === undefined) {
      return '';
    }
    // Eliminar tanto comas como puntos
    return value.replace(/[,.]/g, '');
  }

}
