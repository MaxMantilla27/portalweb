import {ErrorHandler, Injectable} from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
   const chunkFailedMessage = /Loading chunk [^\s]+ failed/;

    if (chunkFailedMessage.test(error.message)) {
      console.error(error);
      console.error(window);
      console.error(document.referrer);
      //window.location.reload();
    }
    console.error(error);
  }
}
