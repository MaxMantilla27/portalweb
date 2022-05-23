import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarServiceService {
  constructor(private matSnackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string,duration:number,
    className?: any,
    hPosition?: any, vPosition? : any ) {
    this.matSnackBar.open(message, action, {
      duration: duration*1000,
      horizontalPosition: hPosition ? hPosition : 'center',
      verticalPosition: vPosition ? vPosition : 'top',
      panelClass: className
      // direction: "rtl"
    });
  }
}
