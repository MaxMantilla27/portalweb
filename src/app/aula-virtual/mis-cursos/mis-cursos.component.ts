import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import {  Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CuentaService } from 'src/app/Core/Shared/Services/Cuenta/cuenta.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { VigenciaAccesoPruebaComponent } from './vigencia-acceso-prueba/vigencia-acceso-prueba/vigencia-acceso-prueba.component';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MisCursosComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService: DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    private _CuentaService: CuentaService,
    public dialog: MatDialog,
    private _Router:Router,
    private title:Title,
    private _HelperService:HelperService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public migaPan = [
    {
      titulo: 'Mis cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public textoBienvenido = '';
  public matriculas: Array<any> = [];
  public matriculasPrueba: Array<any> = [];
  public fecha = new Date();


  ngOnInit(): void {

    let t:string='Mis Cursos'
    this.title.setTitle(t)

    this.textoBienvenido =
      '¡Bienvenido! Tienes acceso a los siguientes cursos:';
    this.GetDatosPerfilService();
    this.ObtenerCursosPrueba();
  }
  GetDatosPerfilService() {
    this._DatosPerfilService.RegistroProgramaMatriculado().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.matriculas = x;
        this.matriculas.forEach(p=>{
          p.tipoModalidad=parseInt(p.tipoModalidad)
        })
      },
    });
  }
  ObtenerCursosPrueba(){
    this._CuentaService.ObtenerListaCursosPrueba().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.matriculasPrueba = x;
        if(this.matriculasPrueba!=null){
          this.matriculasPrueba.forEach(p=>{
            p.tipoModalidad=parseInt(p.tipoModalidad)
          })
        }
      }
    })
  }
  saveIndex(index:number){
    this._SessionStorageService.SessionSetValue('cursoIndex',index.toString());
  }
  saveindexPrueba(index:number,url:string,valid:any){
    if(!valid){
      const dialogRef = this.dialog.open(VigenciaAccesoPruebaComponent, {
        width: '400px',
        data: { },
        panelClass: 'dialog-programas-prueba',
      });

      dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      });
    }else{
      this._SessionStorageService.SessionSetValue('cursoIndex',index.toString());
      this._Router.navigate([url])
    }
  }
  EventoInteraccion(nombre:string,programa:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Programa:programa})
  }
}
