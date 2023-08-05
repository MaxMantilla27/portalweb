import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as saveAs from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { MaterialAdicionalService } from 'src/app/Core/Shared/Services/MaterialAdicional/material-adicional.service';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

@Component({
  selector: 'app-material-estudio-docente',
  templateUrl: './material-estudio-docente.component.html',
  styleUrls: ['./material-estudio-docente.component.scss'],
})
export class MaterialEstudioDocenteComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    private _MaterialAdicionalService: MaterialAdicionalService,
    private _DatosPerfilService:DatosPerfilService
  ) {}

  @Input() IdPespecifico:any;
  public presentaciones: Array<any> = [];
  public material: Array<any> = [];
  @Input() idPGeneral: any;
  public sesiones:any;
  ngOnInit(): void {
    console.log(this.IdPespecifico);
    this.MaterialAdicionalOnline();
    this.ObtenerSesionesOnlineWebinarDocentePorIdPespecifico();
  }
  ObtenerMaterialAdicionalDocentePespecifico() {
    console.log(this.IdPespecifico)
    this._PEspecificoEsquemaService
      .ObtenerMaterialAdicionalDocentePespecifico(this.IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.material = x;
          if(this.material!=null){
            this.material.forEach((m:any) => {
              this.sesiones.forEach((s:any) => {
                if(m.idPEspecificoSesion==s.idSesion){
                  var number=''
                  if(s.orden>9){
                    number='0'
                  }
                  number+=''+s.orden.toString()
                  console.log(number)
                  m.nombreArchivo="Sesión "+number+" - "+m.nombreArchivo
                }
              });
            });
          }
        },
      });
  }

  ObtenerSesionesOnlineWebinarDocentePorIdPespecifico() {
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(this.IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.sesiones = x;
          if(this.sesiones!=undefined && this.sesiones!=null &&this.sesiones.length>0){
            this.ObtenerMaterialAdicionalDocentePespecifico();
          }
          console.log(this.sesiones);
        },
      });
  }
  MaterialAdicionalOnline() {
    this._MaterialAdicionalService
      .MaterialAdicionalOnline(this.idPGeneral, this.IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.presentaciones = x;
        },
      });
  }
  DescargarTodo(){
    // const a = document.getElementById('present-'+0)
    // if(a!=null){
    //   a.click()
    // }
    var i=0
    if(this.presentaciones!=null){
      this.presentaciones.forEach(item => {
        if(item.enlaceArchivo.split('.')[item.enlaceArchivo.split('.').length-1]=='pdf'){
          var blob = new Blob([item.enlaceArchivo.includes('https')?item.enlaceArchivo:'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/material-adiconal/'+item.enlaceArchivo], { type: 'application/pdf' });
          var file =  new File([blob], item.nombreArchivo+'.pdf', { type: 'application/pdf' });
          saveAs(file)
        }
        if(item.enlaceArchivo.split('.')[item.enlaceArchivo.split('.').length-1]=='zip' ||
        item.enlaceArchivo.split('.')[item.enlaceArchivo.split('.').length-1]=='rar'){
          var blob = new Blob([item.enlaceArchivo.includes('https')?item.enlaceArchivo:'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/material-adiconal/'+item.enlaceArchivo], { type: 'application/pdf' });
          var file =  new File([blob], item.nombreArchivo+'.'+item.enlaceArchivo.split('.')[item.enlaceArchivo.split('.').length-1], { type: 'application/'+item.enlaceArchivo.split('.')[item.enlaceArchivo.split('.').length-1] });
          saveAs(file)
        }
        i++
      });
    }
    if(this.material!=null){
      this.material.forEach(item => {
        if(item.urlArchivoSubido.split('.')[item.urlArchivoSubido.split('.').length-1]=='pdf'){
          var blob = new Blob([item.urlArchivoSubido], { type: 'application/pdf' });
          var file =  new File([blob], item.nombreArchivo+'.pdf', { type: 'application/pdf' });
          saveAs(file)
        }
        if(item.urlArchivoSubido.split('.')[item.urlArchivoSubido.split('.').length-1]=='zip' ||
        item.urlArchivoSubido.split('.')[item.urlArchivoSubido.split('.').length-1]=='rar'){
          var blob = new Blob([item.urlArchivoSubido], { type: 'application/pdf' });
          var file =  new File([blob], item.nombreArchivo+'.'+item.urlArchivoSubido.split('.')[item.urlArchivoSubido.split('.').length-1], { type: 'application/'+item.urlArchivoSubido.split('.')[item.urlArchivoSubido.split('.').length-1] });
          saveAs(file)
        }
      });
    }
  }
}
