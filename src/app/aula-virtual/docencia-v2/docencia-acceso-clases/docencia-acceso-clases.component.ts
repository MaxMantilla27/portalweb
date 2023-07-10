import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { ProgramaEspecificoIntegraService } from 'src/app/Core/Shared/Services/ProgramaEspecificoIntegra/programa-especifico-integra.service';

@Component({
  selector: 'app-docencia-acceso-clases',
  templateUrl: './docencia-acceso-clases.component.html',
  styleUrls: ['./docencia-acceso-clases.component.scss']
})
export class DocenciaAccesoClasesComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  columnHeader:any =  {
    'fechaHoraInicio': 'Fecha',
    'tipo':'Tipo',
    'cursoNombre': 'Nombre Curso Especifico' ,
    'HoraInicio': 'Hora Inicio',
    'HoraFinal': 'Hora Fin',
    'ses': 'Sesión'};

  TipoContenido:any={
    'fechaHoraInicio': ['date'],
    'HoraInicio': ['hora'],
    'HoraFinal': ['hora'],
    //'Acciones': ['buttons'],
  }
  tableData: any;
  public Actual:any
  public interval:any
  OpenProx=true
  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _ProgramaEspecificoIntegraService:ProgramaEspecificoIntegraService,
    private _DatosPerfilService:DatosPerfilService
  ) { }
  @Input() IdProveedor=0;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdProveedor)
    if(this.IdProveedor>0){
      this.ObtenerSesionesOnlineWebinarPorProveedor()
    }
  }
  ObtenerSesionesOnlineWebinarPorProveedor(){
    this._DatosPerfilService.ObtenerSesionesOnlineWebinarDocente().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)

        this.tableData=[]
        this.Actual=[]
        var primero=true
        x.forEach((s:any) => {

          if(s.esVisible==true){
            var f=new Date(s.fechaHoraInicio);
            f.setMinutes(f.getMinutes()+(s.duracion*60))
            s.fechaHoraFinal=f

            let f1=new Date((new Date(s.fechaHoraInicio)).getFullYear(),(new Date(s.fechaHoraInicio)).getMonth(),(new Date(s.fechaHoraInicio)).getDate());
            let f2=new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate());
            if(+f1==+f2){
              this.Actual.push(s)
            }else{
              // if(this.proximoW.length>0){
              //   this.tableData.push(s)
              // }else{
              //   this.proximoW.push(s)
              // }
              this.tableData.push(s)
              primero=false
            }
          }
        });
        var pending=0
        this.Actual.forEach((a:any) => {
          a.IsValid=false
          let f1=new Date(a.fechaHoraInicio);
          let f2=new Date();
          var diference=((f1.getHours()*60)+f1.getMinutes())-((f2.getHours()*60)+f2.getMinutes());

          if(diference<=15){
            if(a.urlWebex!=null){
              a.IsValid=true;
            }
          }else{
            pending++
          }
        });
        if(pending>0){
          this.SetIntervalo();
        }
        if(this.tableData!=undefined && this.tableData!=null && this.tableData.length){
          this.tableData.forEach((c:any) => {
            c.HoraInicio=c.fechaHoraInicio;
            c.HoraFinal=c.fechaHoraFinal;
            if(c.tipo!='Webinar'){
              c.ses=c.orden+' de '+ c.maximo
            }else{
              c.ses=''
            }
            c.Acciones=c.urlWebex==null?'Próximamente':'Ir  a clase'
          });
        }
      }
    })
  }
  SetIntervalo(){
    this.interval=setInterval(() => {
      var pending=0
      this.Actual.forEach((a:any) => {
        if(a.IsValid==false){
          let f1=new Date(a.fechaHoraInicio);
          let f2=new Date();
          var diference=((f1.getHours()*60)+f1.getMinutes())-((f2.getHours()*60)+f2.getMinutes());
          if(diference<=15){
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
}
