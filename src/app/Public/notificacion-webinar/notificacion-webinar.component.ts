import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroWebinarService } from 'src/app/Core/Shared/Services/RegistroWebinar/registro-webinar.service';

@Component({
  selector: 'app-notificacion-webinar',
  templateUrl: './notificacion-webinar.component.html',
  styleUrls: ['./notificacion-webinar.component.scss'],
})
export class NotificacionWebinarComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private _RegistroWebinarService:RegistroWebinarService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public ses = 0;
  public mat = 0;
  public est = false;
  public notification=''
  public esCorrecto=false
  ngOnInit(): void {
    this.ActivatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe((params) => {
      this.ses = params['ses'];
      this.mat = params['mat'];
      this.est = params['est'];
      console.log(this.ses+'-'+this.mat+'-'+this.est)
      this.ConfirmarAsistencia();
    });
  }
  ConfirmarAsistencia(){
    this._RegistroWebinarService.ConfirmarAsistencia(this.ses,this.mat,this.est).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.notification=x.respuestaApi.mensaje
        this.esCorrecto=x.respuestaApi.esCorrecto
      }
    })
  }
}
