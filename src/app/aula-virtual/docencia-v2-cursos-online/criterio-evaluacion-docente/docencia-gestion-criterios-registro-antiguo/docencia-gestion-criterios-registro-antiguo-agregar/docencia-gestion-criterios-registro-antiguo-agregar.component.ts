import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { EvaluacionRegistrarDTO } from 'src/app/Core/Models/EvaluacionRegistrarDTO';
import { OperacionesEvaluacionService } from 'src/app/Core/Shared/Services/OperacionesEvaluacion/operaciones-evaluacion.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-docencia-gestion-criterios-registro-antiguo-agregar',
  templateUrl: './docencia-gestion-criterios-registro-antiguo-agregar.component.html',
  styleUrls: ['./docencia-gestion-criterios-registro-antiguo-agregar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaGestionCriteriosRegistroAntiguoAgregarComponent implements OnInit ,OnDestroy{

  private signal$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<DocenciaGestionCriteriosRegistroAntiguoAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _SnackBarServiceService: SnackBarServiceService,
    private _OperacionesEvaluacionService:OperacionesEvaluacionService
  ) { }
  public json:EvaluacionRegistrarDTO={
    Grupo:0,
    Id:0,
    IdCriterioEvaluacion:null,
    IdPEspecifico:0,
    Nombre:'',
    Porcentaje:0,
    Usuario:'',
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public charge=false;
  ngOnInit(): void {
    console.log(this.data)
    this.json.Id=this.data.Id
    this.json.Nombre=this.data.Nombre
    this.json.Porcentaje=this.data.Porcentaje
    this.json.Grupo=this.data.Grupo
    this.json.Usuario=this.data.Usuario
    this.json.IdPEspecifico=this.data.IdPEspecifico
  }
  Actualizar(){
    if(this.charge==false && this.json.Porcentaje>0 && this.json.Nombre.length>0){
      this.charge=true;
      this._OperacionesEvaluacionService.Actualizar(this.json).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");
          this.dialogRef.close(true);
        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          this.dialogRef.close();
        }
      })
    }
  }
  Registrar(){
    if(this.charge==false && this.json.Porcentaje>0 && this.json.Nombre.length>0){
      this.charge=true;
      this._OperacionesEvaluacionService.Registrar(this.json).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");
          this.dialogRef.close(true);
        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          this.dialogRef.close();
        }
      })
    }
  }
}
