import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removePortalCriterio'
})
export class RemovePortalCriterioPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace('Portal-', '');
  }

}
