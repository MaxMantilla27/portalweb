import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import {
  LibroReclamacionesDTO,
  MensajeCorreoDTO,
} from 'src/app/Core/Models/LibroReclamacionesDTO';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { LibroReclamacionService } from 'src/app/Core/Shared/Services/LibroReclamacion/libro-reclamacion.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.component.html',
  styleUrls: ['./libro-reclamaciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LibroReclamacionesComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _HelperService: HelperService,
    private _DatosPortalService: DatosPortalService,
    private _LibroReclamacionService: LibroReclamacionService,
    private _SnackBarServiceService:SnackBarServiceService,
    private title:Title,
    private meta:Meta
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  pipe = new DatePipe('en-US')
  public migaPan: any = [];
  public fecha = new Date();
  detalleservicio = [];
  public reclamo: LibroReclamacionesDTO = {
    Apellido: '',
    CorreoElectronico: '',
    DNI: '',
    DetalleReclamo: '',
    DetalleServicio: '',
    Domicilio: '',
    IdTipoDocumento: 1,
    IdTipoReclamo: 1,
    IdTipoServicioReclamo: 1,
    Nombre: '',
    OtroDetalleServicio: '',
    PedidoReclamo: '',
    Referente: '',
    Telefono: '',
  };
  public jsonCorreo: MensajeCorreoDTO = {
    Asunto: '',
    Contenido: '',
    Destinatario: '',
  };
  public fechaEnvio = new Date();
  public tipodocumento: any;
  ngOnInit(): void {
    let t:string='Libro de Reclamaciones'
    this.title.setTitle(t);
    this.meta.addTag({name: 'author', content: 'BSG Institute'})

    this.ObtenerCombosPortal();
    setInterval(() => {
      this.fecha = new Date();
    }, 1000);
    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Libro de Reclamaciones',
        urlWeb: '/LibroReclamacion',
      },
    ];
  }
  chageRadio(value: number) {
    if (value == 1) {
      return 2;
    }
    return 1;
  }
  GenerarReclamo() {
    console.log(this.detalleservicio);
    this.reclamo.DetalleServicio = this.detalleservicio.join(' - ');
    this.reclamo.DNI = this.reclamo.DNI.toString();
    console.log(this.reclamo);
    this._LibroReclamacionService
      .RegistrarLibroReclamacion(this.reclamo)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.fechaEnvio = this.fecha;
          if (x == true) {
            this.EnvioCorreo();
          }
        },
      });
  }
  EnvioCorreo() {
    this.jsonCorreo.Asunto =
      'Nuevo registro en el libro de reclamaciones virtual de BSG Institute';
    this.jsonCorreo.Destinatario = this.reclamo.CorreoElectronico;
    this.jsonCorreo.Contenido =
      "<div style='font-family: Arial;font-size: 14px;'>Me es grato saludarlo desde BSG Institute<br><br>Informarle que se ha generado el siguiente registro en el libro de reclamaciones virtual de nuestro sitio web:" +
      '<br><br><span>Fecha: </span>' +
      this.pipe.transform(this.fechaEnvio, 'short')+
      // this.fechaEnvio.getUTCFullYear() +
      // '/' +
      // (this.fechaEnvio.getUTCMonth() + 1) +
      // '/' +
      // this.fechaEnvio.getUTCDate() +
      // ' ' +
      // (this.fechaEnvio.getUTCHours()-5) +
      // ':' +
      // this.fechaEnvio.getUTCMinutes() +
      // ':' +
      // this.fechaEnvio.getUTCSeconds() +
      '<br><br><strong>1. IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE</strong>' +
      '<br><strong>Nombre: </strong>' +
      this.reclamo.Nombre +
      ' ' +
      this.reclamo.Apellido +
      '<br><strong>Domicilio: </strong>' +
      this.reclamo.Domicilio +
      '<br><strong>DNI/CE: </strong>' +
      this.reclamo.DNI +
      '<br><strong>Celular: </strong>' +
      this.reclamo.Telefono +
      '<br><strong>Correo Electrónico: </strong>' +
      this.reclamo.CorreoElectronico +
      '<br><strong>Padre, madre o apoderado (en caso de ser menor de edad): </strong>' +
      this.reclamo.Referente +
      '<br><br><strong>2. IDENTIFICACIÓN DEL BIEN/SERVICIO CONTRATADO</strong>' +
      '<br><strong>Bien o servicio: </strong>' +
      (this.reclamo.IdTipoServicioReclamo == 1 ? 'Bien' : 'Servicio') +
      '<br><strong>Indicar Bien o servicio: </strong>' +
      this.reclamo.DetalleServicio +
      '<br><br><strong>3. DETALLE DE LA RECLAMACIÓN</strong>' +
      '<br><strong>Reclamo o queja: </strong>' +
      (this.reclamo.IdTipoReclamo == 1 ? 'Reclamo' : 'Queja') +
      '<br><strong>Detalle: </strong>' +
      this.reclamo.DetalleReclamo +
      '<br><strong>Pedido: </strong>' +
      this.reclamo.PedidoReclamo +
      '<br><br><span>Saludos Cordiales,<br>Servicio de atenci&oacute;n al cliente.<br>BSG Institute</span>' +
      "</div><br><br><hr><span style='font-family: Arial;font-size: 10px;line-height: 16px;text-align: justify;color: #82879e;'>Correo enviado al destinatario " +
      this.reclamo.CorreoElectronico +
      ' por nuestra web bsginstitute.com, favor de no responder a este correo debido a que es un sistema de comunicacion e informes.</span>';
    this._LibroReclamacionService.EnvioCorreo(this.jsonCorreo).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        if(!x){
          this._SnackBarServiceService.openSnackBar("Ocurrió un error, comunícate con tu asesor",'x',15,"snackbarCrucigramaerror");
        }else{
          this._SnackBarServiceService.openSnackBar("Se genero correctamente su reclamo",'x',15,"snackbarCrucigramaSucces");
        }
      },
    });
  }

  ObtenerCombosPortal() {
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        this.tipodocumento = x.listaTipoDocumento;
      },
    });
  }
}
