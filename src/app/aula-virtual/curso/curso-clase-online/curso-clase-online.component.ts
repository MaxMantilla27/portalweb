import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

import { Router } from '@angular/router';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
@Component({
  selector: 'app-curso-clase-online',
  templateUrl: './curso-clase-online.component.html',
  styleUrls: ['./curso-clase-online.component.scss']
})
export class CursoClaseOnlineComponent implements OnInit,OnDestroy,OnChanges {

  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService:DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    private router:Router,
    private _AsistenciaService: AsistenciaService,
  ) { }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  @Input() escurso:any;
  @Input() IdTipoProgramaCarrera=0;
  public clases:any
  public total=0
  public actual:any
  public proximo:any
  columnHeader:any = {
    'fechaHoraInicio': 'Fecha',
    'cursoNombre': 'Nombre Curso Específico' ,
    'HoraInicio': 'Hora Inicio',
    'HoraFinal': 'Hora Fin',
    'ses': 'Sesión' };

  TipoContenido:any={
    'fechaHoraInicio': ['date'],
    'HoraInicio': ['hora'],
    'HoraFinal': ['hora'],
    //'Acciones': ['buttons'],
  }
  EsButton:any={
    'cursoNombre': true
  }
  OpenProx=true
  public interval:any
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
    console.log(this.IdTipoProgramaCarrera)
      //this.ListaCursoWebexMatriculado();
      this.ListaCursoWebexMatriculadoV2();

    }
    if(this.escurso!=undefined){
      if(this.escurso==false){
        this.columnHeader = {
          'fechaHoraInicio': 'Fecha',
          'cursoNombre': 'Nombre Curso Específico' ,
          'HoraInicio': 'Hora Inicio',
          'HoraFinal': 'Hora Fin',
          'ses': 'Sesión',};
      }
    }
  }
  ListaCursoWebexMatriculadoV2(){
    this.clases=[]
    this.actual=[]
    if(this.IdTipoProgramaCarrera==2){
      this._DatosPerfilService.ListaCursoWebexMatriculadoCarrerasProfesionales(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          var i=0
          var primero=true
          x.forEach((s:any) => {
            if(s.idMatriculaCabecera==65033){
              s.urlWebex='https://bsginstitute.webex.com/meet/webexinstitutobsg3'
            }
            if(s.claseActiva==true || s.esVisible==true){
              i++
              s.Sesion=i;
            }
            if(s.esVisible==true){
              var f=new Date(s.fechaHoraInicio);
              f.setMinutes(f.getMinutes()+(s.duracion*60))
              s.fechaHoraFinal=f

              if(primero==true){

                let f1=new Date((new Date(s.fechaHoraInicio)).getFullYear(),(new Date(s.fechaHoraInicio)).getMonth(),(new Date(s.fechaHoraInicio)).getDate());
                let f2=new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate());

                if(+f1==+f2){
                  this.actual.push(s)
                }else{
                  if(this.actual.length>0){
                    this.clases.push(s)
                  }else{
                    this.proximo=s
                  }
                  primero=false
                }
              }else{
                this.clases.push(s)
              }
            }
          });
          this.total=i;
          var pending=0
          this.actual.forEach((a:any) => {
            a.IsValid=false
            let f1=new Date(a.fechaHoraInicio);
            let f2=new Date();
            let f3=new Date(a.fechaHoraFinal);

            var diference=((f1.getHours()*60)+f1.getMinutes())-((f2.getHours()*60)+f2.getMinutes());
            var diferenceFin=((f1.getHours()*60)+f1.getMinutes())-((f3.getHours()*60)+f3.getMinutes());

            if(a.urlWebex!=null){
              a.IsValid=true;
            }
          });
          if(pending>0){
            // this.SetIntervalo();
          }
          if(this.clases!=undefined && this.clases!=null && this.clases.length){
            this.clases.forEach((c:any) => {
              c.HoraInicio=c.fechaHoraInicio;
              c.HoraFinal=c.fechaHoraFinal;
              c.ses=c.orden+' de '+ c.maximo
              c.Acciones=c.urlWebex==null?'Próximamente':'Ir  a clase'
            });
          }
        },
        complete:()=> {
        },
        error:e=>{
          console.log(e)
        }

      })

    }
    else{
      this._DatosPerfilService.ListaCursoWebexMatriculadoV2(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          var i=0
          var primero=true
          x.forEach((s:any) => {
            if(s.claseActiva==true || s.esVisible==true){
              i++
              s.Sesion=i;
            }
            if(s.esVisible==true){
              var f=new Date(s.fechaHoraInicio);
              f.setMinutes(f.getMinutes()+(s.duracion*60))
              s.fechaHoraFinal=f

              if(primero==true){

                let f1=new Date((new Date(s.fechaHoraInicio)).getFullYear(),(new Date(s.fechaHoraInicio)).getMonth(),(new Date(s.fechaHoraInicio)).getDate());
                let f2=new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate());

                if(+f1==+f2){
                  this.actual.push(s)
                }else{
                  if(this.actual.length>0){
                    this.clases.push(s)
                  }else{
                    this.proximo=s
                  }
                  primero=false
                }
              }else{
                this.clases.push(s)
              }
            }
          });
          this.total=i;
          var pending=0
          this.actual.forEach((a:any) => {
            a.IsValid=false
            let f1=new Date(a.fechaHoraInicio);
            let f2=new Date();
            let f3=new Date(a.fechaHoraFinal);
            var diference=((f1.getHours()*60)+f1.getMinutes())-((f2.getHours()*60)+f2.getMinutes());
            var diferenceFin=((f1.getHours()*60)+f1.getMinutes())-((f3.getHours()*60)+f3.getMinutes());

            if(a.urlWebex!=null){
              a.IsValid=true;
            }
        });
        if(pending>0){
          // this.SetIntervalo();
        }
        if(this.clases!=undefined && this.clases!=null && this.clases.length){
        console.log(this.clases)
          this.clases.forEach((c:any) => {
            c.HoraInicio=c.fechaHoraInicio;
            c.HoraFinal=c.fechaHoraFinal;
            c.ses=c.orden+' de '+ c.maximo
            c.Acciones=c.urlWebex==null?'Próximamente':'Ir  a clase'
          });
        }
      },
      error:e=>{
        console.log(e)
      }
    })
  }
  }
  SetIntervalo(){
    this.interval=setInterval(() => {
      var pending=0
      this.actual.forEach((a:any) => {
        if(a.IsValid==false){
          let f1=new Date(a.fechaHoraInicio);
          let f2=new Date();
          let f3=new Date(a.fechaHoraFinal);

          var diference=((f1.getHours()*60)+f1.getMinutes())-((f2.getHours()*60)+f2.getMinutes());
          var diferenceFin=((f1.getHours()*60)+f1.getMinutes())-((f3.getHours()*60)+f3.getMinutes());

          if(diference<=15 && diference>=diferenceFin){
            if(a.urlWebex!=null){
              a.IsValid=true;
            }
          }else{
            pending++
          }
        }
        if(pending==0){
          clearInterval(this.interval);
        }
      });
    }, 5000);
  }
  ListaCursoWebexMatriculado(){
    this._DatosPerfilService.ListaCursoWebexMatriculado(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.clases=x
        if(this.clases!=undefined && this.clases!=null && this.clases.length){
          this.clases.forEach((c:any) => {
            c.HoraInicio=c.fechaHoraInicio;

            c.Acciones=c.urlWebex==null?'Próximamente':'Ir  a clase'
          });
        }
      },
      error:e=>{
        console.log(e)
      }
    })
  }
  IrAcurso(e:any){
    this.router.navigate(['/AulaVirtual/MisCursos/'+this.IdMatricula+'/'+this.clases[e].idPespecifico]);
  }
  RegistrarAsistenciaAlumno(IdSesion:number){
    console.log(IdSesion)
    this._AsistenciaService.RegistrarAsistenciaMatricula(this.IdMatricula, IdSesion ).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      },
      error:e=>{
        console.log(e)
      }
    })
  }
}
