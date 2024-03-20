import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SanityChecks } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { EvaluacionRegistrarDTO, PEspecificoSilaboRegistrarDTO } from 'src/app/Core/Models/EvaluacionRegistrarDTO';
import { OperacionesEvaluacionService } from 'src/app/Core/Shared/Services/OperacionesEvaluacion/operaciones-evaluacion.service';
import { OperacionesPEspecificoService } from 'src/app/Core/Shared/Services/OperacionesPEspecifico/operaciones-pespecifico.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { DocenciaGestionSilabosRegistroAddComponent } from 'src/app/aula-virtual/docencia/docencia-gestion-silabos/docencia-gestion-silabos-registro/docencia-gestion-silabos-registro-add/docencia-gestion-silabos-registro-add.component';
import { DocenciaGestionCriteriosRegistroAntiguoAgregarComponent } from './docencia-gestion-criterios-registro-antiguo-agregar/docencia-gestion-criterios-registro-antiguo-agregar.component';


@Component({
  selector: 'app-docencia-gestion-criterios-registro-antiguo',
  templateUrl: './docencia-gestion-criterios-registro-antiguo.component.html',
  styleUrls: ['./docencia-gestion-criterios-registro-antiguo.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DocenciaGestionCriteriosRegistroAntiguoComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<DocenciaGestionCriteriosRegistroAntiguoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _SnackBarServiceService: SnackBarServiceService,
    public dialog: MatDialog,
    private _OperacionesPEspecificoService:OperacionesPEspecificoService,
    private _OperacionesEvaluacionService:OperacionesEvaluacionService
  ) { }
  public json:PEspecificoSilaboRegistrarDTO={
    Id:0,
    Bibliografia:'',
    IdPespecifico:0,
    IdProveedor:0,
    ListadoCriteriosEvaluacion:[],
    Material:'',
    ObjetivoAprendizaje:'',
    PublicoObjetivo:'',
    PautaComplementaria:'',
    Usuario:'',
  }
  public jsonEliminar:EvaluacionRegistrarDTO={
    Grupo:0,
    Id:0,
    IdCriterioEvaluacion:null,
    IdPEspecifico:0,
    Nombre:'',
    Porcentaje:0,
    Usuario:'',
  }
  public charge=false;
  public contenido:any;
  public evaluacion:any;
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    this.PorPrograma(this.data.IdPEspecifico)
    this.ListadoEvaluacionPorPrograma(this.data.IdPEspecifico,this.data.grupo)

    this.jsonEliminar.Grupo=this.data.grupo
    this.jsonEliminar.IdPEspecifico=this.data.IdPEspecifico
    this.jsonEliminar.Usuario=this.data.correo

    this.json.IdProveedor=this.data.idProveedor
    this.json.IdPespecifico=this.data.IdPEspecifico
    this.json.Usuario=this.data.correo
  }
  PorPrograma(idPEspecifico:number){
    this._OperacionesPEspecificoService.PorPrograma(idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.contenido=x
        this.json.Id=this.contenido.Id
        console.log(x)
      }
    })
  }
  ListadoEvaluacionPorPrograma(idPEspecifico:number,grupo:number){
    this._OperacionesEvaluacionService.ListadoEvaluacionPorPrograma(idPEspecifico,grupo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.evaluacion=x
        console.log(x)
      }
    })
  }
  AgregarEvaluacion(index:number|null){
    if(this.charge==false){
      var nombre=''
      var porcentaje=0
      var ident=null
      if(index!=null){
        nombre=this.evaluacion[index].Nombre
        porcentaje=this.evaluacion[index].Porcentaje
        ident=this.evaluacion[index].Id
      }
      const dialogApr = this.dialog.open(DocenciaGestionCriteriosRegistroAntiguoAgregarComponent, {
        width: '550px',
        data: {Nombre:nombre,Porcentaje:porcentaje,Id:ident,IdPEspecifico:this.data.IdPEspecifico,Usuario:this.data.correo,Grupo:this.data.grupo},
        panelClass: 'dialog-registrar-criterio-evaluacion-antiguo',
      });

      dialogApr.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
        console.log(result);
        if(result==true){
          this.ListadoEvaluacionPorPrograma(this.data.IdPEspecifico,this.data.grupo)
        }
      });
    }
  }
  EliminarEvaluacion(index:number){
    if(this.charge==false){
      this.charge=true;
      this.jsonEliminar.Id=this.evaluacion[index].Id
      this.jsonEliminar.Nombre=this.evaluacion[index].Nombre
      this.jsonEliminar.Porcentaje=this.evaluacion[index].Porcentaje

      this._OperacionesEvaluacionService.Eliminar(this.jsonEliminar).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se elimino correctamente",'x',5,"snackbarCrucigramaSucces");
          this.ListadoEvaluacionPorPrograma(this.data.IdPEspecifico,this.data.grupo)
        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          this.ListadoEvaluacionPorPrograma(this.data.IdPEspecifico,this.data.grupo)
        }
      })
    }
  }
  AprobarSilaboDetalleDocente(){
    if(this.charge==false){
      this.charge=true;
      this.json.Bibliografia=this.contenido.Bibliografia
      this.json.Material=this.contenido.Material
      this.json.ObjetivoAprendizaje=this.contenido.ObjetivoAprendizaje
      this.json.PublicoObjetivo=this.contenido.PublicoObjetivo
      this.json.PautaComplementaria=this.contenido.PautaComplementaria
      this.json.ListadoCriteriosEvaluacion=[]
      this.evaluacion.forEach((evl:any) => {
        this.json.ListadoCriteriosEvaluacion.push({
          Grupo:evl.Grupo,
          Id:evl.Id,
          IdCriterioEvaluacion:evl.IdCriterioEvaluacion,
          IdPEspecifico:evl.IdPEspecifico,
          Nombre:evl.Nombre,
          Porcentaje:evl.Porcentaje
        })
      });
      this._OperacionesPEspecificoService.Aprobar(this.json).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se aprobo correctamente",'x',5,"snackbarCrucigramaSucces");
          this.dialogRef.close(true);
        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          this.dialogRef.close(true);
        }
      })
    }
  }
}
