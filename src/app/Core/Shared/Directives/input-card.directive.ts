import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputCard]',
})
export class InputCardDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.split('-').join(' ').replace(/\s+/g, '');

    if (trimmed.length > 16) {
      trimmed = trimmed.slice(0, 16);
    }else{
      if(isNaN(Number(trimmed.slice(trimmed.length-1,trimmed.length)))){
        trimmed = trimmed.slice(0, trimmed.length-1);
      }
    }


    const partitions =
      trimmed.startsWith('34') || trimmed.startsWith('37')
        ? [4, 6, 5]
        : [4, 4, 4, 4];

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
    input.value = numbers.join('-');
  }
}
