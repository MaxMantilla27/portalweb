import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) {}

  transform(value: any,type?: string): unknown {
    console.log(value)
    console.log(type)
    if(type==undefined){
      return this.sanitized.bypassSecurityTrustResourceUrl(value);
    }
    switch (type) {
      case 'html':
        return this.sanitized.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitized.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitized.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitized.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitized.bypassSecurityTrustResourceUrl(value);
      default:
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
  }
}
