import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputCardFecha]'
})
export class InputCardFechaDirective {

  constructor() { }
  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.split('/').join(' ').replace(/\s+/g, '');

    if (trimmed.length > 4) {
      trimmed = trimmed.slice(0, 4);
    }else{
      if(isNaN(Number(trimmed.slice(trimmed.length-1,trimmed.length)))){
        trimmed = trimmed.slice(0, trimmed.length-1);
      }else{
        if(trimmed.length==1){
          var month=input.value.split('/');
          if(Number(month[0])>1){
            trimmed = '1';
          }
        }
        if(trimmed.length<3){
          var month=input.value.split('/');
          if(Number(month[0])>12){
            trimmed = trimmed.slice(0, trimmed.length-1);
          }
        }
      }
    }

    const partitions = [2,2];

    const numbers: any = [];
    let position = 0;
    let actual = 0;
    partitions.forEach((partition) => {
      actual+=partition
      const part = trimmed.slice(position, actual);
      if (part) {
        numbers.push(part);
        position += partition;
      }
    });
    input.value = numbers.join('/');
  }
}
