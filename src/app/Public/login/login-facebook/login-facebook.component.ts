import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loginSendFacebookDTO } from 'src/app/Core/Models/login';

@Component({
  selector: 'app-login-facebook',
  templateUrl: './login-facebook.component.html',
  styleUrls: ['./login-facebook.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginFacebookComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginFacebookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: loginSendFacebookDTO,
    ) { }

  ngOnInit(): void {
    console.log(this.data)
  }
  cerrar(){
    this.dialogRef.close();
  }
}
