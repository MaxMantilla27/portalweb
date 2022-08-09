import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EvaluacionPromedioCrucigramaDTO, ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CrucigramaService } from '../../Services/Crucigrama/crucigrama.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-crucigrama',
  templateUrl: './crucigrama.component.html',
  styleUrls: ['./crucigrama.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CrucigramaComponent implements OnInit,OnChanges ,OnDestroy{
  private signal$ = new Subject();

  constructor(
    private _SessionStorageService:SessionStorageService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _CrucigramaService:CrucigramaService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
    clearInterval(this.interval);
  }
  @Input() Crucigrama:any

  @Output()
  ButtoclClick: EventEmitter<void> = new EventEmitter<void>();
  @Input() json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad:1
  };
  public matris:Array<Array<{select:boolean,esCampo:boolean,valor:string,pregunta:number,esprimero:boolean,finalizado:boolean}>>=[];
  public crucigrmaAvance:
  {Pistas:number,contra:number,minutos:number, segundos:number,valores:Array<{values:string,finalizado:boolean,ayuda:boolean}>,id:number}
  ={Pistas:10,contra:0,minutos:10,segundos:0,valores:[],id:0}
  public deficnicionActual=''
  public valorActual=''
  public valorIngresado=''
  public indexY=0;
  public indexX=0;
  public PreguntaActual=-1;
  public bloquear=false
  public rpta:any
  public jsonEnvio:EvaluacionPromedioCrucigramaDTO={
    AccesoPrueba:false,
    Calificacion:0,
    CodigoCrucigrama:'',
    Id:0,
    IdCrucigrama:0,
    IdPEspecifico:0,
    IdPEspecificoPadre:0,
    IdPGeneral:0,
    IdPrincipal:0,
    OrdenFilaCapitulo:0,
    OrdenFilaSesion:0,
  }
  public interval:any
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.Crucigrama!=undefined){

      // this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle.sort(function (a:any, b:any){
      //   return a.palabra.length - b.palabra.length;
      // })
      this.crucigrmaAvance.id=this.Crucigrama.idCrucigramaProgramaCapacitacion
      this.CrearCrucigrama();
      this.SetValorCrucigrama();
      if(this._SessionStorageService.SessionGetValue('c-'+this.crucigrmaAvance.id.toString()+'ma')!=''){
        this.crucigrmaAvance=JSON.parse(atob(this._SessionStorageService.SessionGetValue('c-'+this.crucigrmaAvance.id.toString()+'ma')));
        this.AddValoresActuales()
      }
      this.cronometro()
    }
  }
  AddValoresActuales(){
    let i=0
    console.log(this.crucigrmaAvance.valores)
    this.crucigrmaAvance.valores.forEach(x=>{
      if(x.values.length>0 && x.ayuda==false){
        this.indexX=this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[i].pos[0]
        this.indexY=this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[i].pos[1]
        this.valorActual= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[i].palabra
        this.addValorImputCrucigrama(x.values,i)
        if(x.finalizado==true){
          this.setFinalizado(i,x.values)
        }
      }
      i++
    })
    i=0
    this.crucigrmaAvance.valores.forEach(x=>{
      if(x.values.length>0 && x.ayuda==true){
        this.indexX=this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[i].pos[0]
        this.indexY=this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[i].pos[1]
        this.valorActual= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[i].palabra
        this.addValorImputCrucigrama(x.values,i)
        if(x.finalizado==true){
          this.setFinalizado(i,x.values)
        }
      }
      i++
    })
  }
  calcularCalificacion(){
    var calificacion=100-this.crucigrmaAvance.contra;
    calificacion+=this.crucigrmaAvance.Pistas;
    var i=0
    var letrasFlatantes=0;
    this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle.forEach((items:any) => {
      if(items.finalizado==false){
        letrasFlatantes+=items.palabra.length;
      }
      i++
    });
    calificacion-=letrasFlatantes
    if(calificacion>100) return 100;
    if(calificacion>60) return calificacion;
    return 60;
  }
  saveCrucigrama(){
    this.bloquear=true;
    this.jsonEnvio.AccesoPrueba=this.json.AccesoPrueba;
    this.jsonEnvio.Calificacion=this.calcularCalificacion();
    this.jsonEnvio.CodigoCrucigrama=this.Crucigrama.objetoCrucigramaPrograma.codigoCrucigrama;
    this.jsonEnvio.Id=this.Crucigrama.objetoCrucigramaPrograma.id;
    this.jsonEnvio.IdCrucigrama=this.Crucigrama.idCrucigramaProgramaCapacitacion;
    this.jsonEnvio.IdPEspecifico=this.json.IdPEspecificoHijo;
    this.jsonEnvio.IdPEspecificoPadre=this.json.IdPEspecificoPadre;
    this.jsonEnvio.IdPGeneral=this.json.IdPGeneralHijo;
    this.jsonEnvio.IdPrincipal=this.json.IdPEspecificoPadre;
    this.jsonEnvio.OrdenFilaCapitulo=this.Crucigrama.objetoCrucigramaPrograma.ordenFilaCapitulo;
    this.jsonEnvio.OrdenFilaSesion=this.Crucigrama.objetoCrucigramaPrograma.ordenFilaSesion;
    this._CrucigramaService.EnviarFormularioCrucigrama(this.jsonEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.rpta=x
      }
    })
  }

  cronometro(){
    this.interval=setInterval(() => {
      this.crucigrmaAvance.segundos--
      if(this.crucigrmaAvance.segundos<0){
        this.crucigrmaAvance.segundos=59;
        this.crucigrmaAvance.minutos--
      }
      this.saveValues()
      if(this.crucigrmaAvance.minutos==0 &&  this.crucigrmaAvance.segundos==0){
        this.saveCrucigrama();
      }
    }, 1000);
  }
  SetValorIngresado(){
    console.log(this.valorIngresado)
    if(this.valorIngresado.length>this.valorActual.length){
      console.log(this.valorActual.length)
      console.log(this.valorIngresado.slice(0,this.valorActual.length))
      this.valorIngresado=this.valorIngresado.slice(0,this.valorActual.length)
    }else{
      this.addValorImputCrucigrama(this.valorIngresado,this.PreguntaActual-1)
    }
  }
  selectPregunta(el: HTMLElement,pregunta:number,indexY:number,indexX:number,final:boolean){
    this.indexX=indexX
    this.indexY=indexY
    this.PreguntaActual=pregunta
    var palabraL= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[pregunta-1].palabra.length
    var sentido= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[pregunta-1].sentido
    this.deficnicionActual= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[pregunta-1].pista
    this.valorActual= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[pregunta-1].palabra
    if(pregunta>0 && final==false){
      this.matris.forEach(y=>{
        y.forEach(x=>{
          x.select=false;

        })
      })
      this.matris[indexY][indexX].select=true
      console.log(palabraL)
      if(sentido==0){
        let i=0
        while(i<palabraL){
          this.matris[indexY][indexX].select=true
          indexX++
          i++
        }
      }else{
        let i=0
        while(i<palabraL){
          this.matris[indexY][indexX].select=true
          indexY++
          i++
        }
      }

      el.scrollIntoView();
    }
    this.valorIngresado=this.crucigrmaAvance.valores[pregunta-1].values
    console.log(this.matris)
  }
  SendValor(){
    if(this.valorActual.toLowerCase()!=this.valorIngresado.toLowerCase()){
      this._SnackBarServiceService.openSnackBar("Oh no! No es la palabra correcta.",'x',5,"snackbarCrucigramaerror");
    }else{
      this._SnackBarServiceService.openSnackBar("Correcto!!!",'x',5,"snackbarCrucigramaSucces");
      this.setFinalizado(this.PreguntaActual-1,this.valorIngresado)
      this.PreguntaActual=-1;
    }
  }
  setFinalizado(index:number,varlori:string){
    var palabraL=varlori.length
    var sentido= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[index].sentido
    var indexX=this.indexX
    var indexY=this.indexY
    if(sentido==0){
      let i=0
      while(i<palabraL){
        var letra=varlori.substring(i,i+1)
        this.matris[indexY][indexX].finalizado=true
        indexX++
        i++
      }
    }else{
      let i=0
      while(i<palabraL){
        var letra=varlori.substring(i,i+1)
        this.matris[indexY][indexX].finalizado=true
        indexY++
        i++
      }
    }
    this.deficnicionActual=''
    this.valorActual=''
    this.valorIngresado=''
    this.indexY=0;
    this.indexX=0;
    this.crucigrmaAvance.valores[index].values=varlori;
    this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[index].finalizado=true;
    this.crucigrmaAvance.valores[index].finalizado=true;
  }
  GetPista(){
    var valorAtualL=this.valorActual.length;
    if(valorAtualL>=this.valorIngresado.length && this.valorActual!=this.valorIngresado){
      var str=this.valorActual.substring(0,this.valorIngresado.length)
      if(this.valorIngresado.length>0){
        if(this.valorIngresado==str){
          this.valorIngresado=this.valorActual.substring(0,this.valorIngresado.length+1)
        }else{
          this.valorIngresado=this.valorActual.substring(0,1)
        }
      }else{
        this.valorIngresado=this.valorActual.substring(0,1)
      }

      this.addValorImputCrucigrama(this.valorIngresado,this.PreguntaActual-1)
      if(this.crucigrmaAvance.Pistas>0){
        this.crucigrmaAvance.Pistas--
      }else{
        this.crucigrmaAvance.contra++
      }
      this.crucigrmaAvance.valores[this.PreguntaActual-1].values=this.valorIngresado;
      this.crucigrmaAvance.valores[this.PreguntaActual-1].ayuda=true;
    }
  }
  addValorImputCrucigrama(valori:string,index:number){
    var palabraL=valori.length
    var palabramax=this.valorActual.length
    var sentido= this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle[index].sentido
    var indexX=this.indexX
    var indexY=this.indexY
    console.log(this.valorActual+'-'+index+'-'+valori)
    if(sentido==0){
      let i=0
      while(i<palabramax){
        var letra=valori.substring(i,i+1)
        this.matris[indexY][indexX].valor=''
        indexX++
        i++
      }
      var indexX=this.indexX
      i=0
      while(i<palabraL){
        var letra=valori.substring(i,i+1)
        this.matris[indexY][indexX].valor=letra
        indexX++
        i++
      }
    }else{
      let i=0
      while(i<palabramax){
        var letra=valori.substring(i,i+1)
        this.matris[indexY][indexX].valor=letra
        indexY++
        i++
      }
      var indexY=this.indexY
      i=0
      while(i<palabraL){
        var letra=valori.substring(i,i+1)
        this.matris[indexY][indexX].valor=letra
        indexY++
        i++
      }
    }
    this.crucigrmaAvance.valores[index].values=valori;
    console.log(this.crucigrmaAvance.valores[index].values)
  }
  saveValues(){
    this._SessionStorageService.SessionSetValue('c-'+this.crucigrmaAvance.id.toString()+'ma',btoa(JSON.stringify(this.crucigrmaAvance)))
  }
  SetValorCrucigrama(){
    var x=0;
    var y=0;
    var index=0
    this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle.forEach((cru:any)=>{
      this.crucigrmaAvance.valores.push({values:'',finalizado:false,ayuda:false});
      if(cru.sentido==0){
        x=cru.pos[0]+cru.palabra.length-1
        y=cru.pos[1]
        var i=0,p=0
        this.matris[y].forEach(corx=>{
          if(i>=cru.pos[0] && i<=x && (corx.pregunta==0 || p==0)){
            if(p==0){
              corx.esprimero=true;
              p++;
            }
            corx.esCampo=true;
            corx.pregunta=index+1;
            corx.valor=''
          }
          i++
        })
      }else{
        x=cru.pos[0]
        y=cru.pos[1]+cru.palabra.length-1
        var i=0,p=0
        this.matris.forEach(cory=>{

          if(i>=cru.pos[1] && i<=y && (cory[x].pregunta==0 || p==0)){
            if(p==0){
              cory[x].esprimero=true;
              p++;
            }
            cory[x].esCampo=true;
            cory[x].pregunta=index+1;

          }
          i++
        })
      }
      index++;
    })
  }
  CrearCrucigrama(){
    var x=0;
    var y=0;
    this.Crucigrama.objetoCrucigramaPrograma.crucigramaDetalle.forEach((cru:any)=>{
      cru.pos[0]=parseInt(cru.pos[0])
      cru.pos[1]=parseInt(cru.pos[1])
      cru.finalizado=false;
      if(cru.sentido==0){
        var i=0,j=0
        if(x<cru.pos[0]+cru.palabra.length){
          this.matris.forEach(corx=>{
            i=0
            while(i<(cru.pos[0]+cru.palabra.length-x)){
              corx.push({select:false,esCampo:false,valor:'',pregunta:0,esprimero:false,finalizado:false})
              i++;
            }
          })
          x=cru.pos[0]+cru.palabra.length;
        }
        i=0
        if(y<cru.pos[1]){
          while(i<(cru.pos[1]-y)){
            var matrisx:Array<{select:boolean,esCampo:boolean,valor:string,pregunta:number,esprimero:boolean,finalizado:boolean}>=[]
            j=0
            while(j<x){
              matrisx.push({select:false,esCampo:false,valor:'',pregunta:0,esprimero:false,finalizado:false})
              j++
            }
            this.matris.push(matrisx);
            i++
          }
          y=cru.pos[1];

        }
      }else{
        var i=0,j=0
        if(x<cru.pos[0]+ 1){
          this.matris.forEach(corx=>{
            i=0
            while(i<(cru.pos[0]-x)){
             corx.push({select:false,esCampo:false,valor:'',pregunta:0,esprimero:false,finalizado:false})
              i++;
            }
          })
          x=cru.pos[0];
        }
        i=0
        if(y<cru.pos[1]+cru.palabra.length){
          while(i<(cru.pos[1]+cru.palabra.length-y)){
            var matrisx:Array<{select:boolean,esCampo:boolean,valor:string,pregunta:number,esprimero:boolean,finalizado:boolean}>=[]
            j=0
            while(j<x){
              matrisx.push({select:false,esCampo:false,valor:'',pregunta:0,esprimero:false,finalizado:false})
              j++
            }
            this.matris.push(matrisx);
            i++
          }
          y=cru.pos[1]+cru.palabra.length;
        }
      }
    })
    console.log(this.matris)
  }
}
