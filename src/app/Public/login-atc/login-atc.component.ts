import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { AlumnoService } from 'src/app/Core/Shared/Services/Alumno/alumno.service';
import { AspNetUserService } from 'src/app/Core/Shared/Services/AspNetUser/asp-net-user.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-login-atc',
  templateUrl: './login-atc.component.html',
  styleUrls: ['./login-atc.component.scss']
})
export class LoginATCComponent implements OnInit {

  constructor(
    private _AspNetUserService:AspNetUserService,
    private router: Router,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _FormaPagoService:FormaPagoService,
    public dialog: MatDialog,
    private title:Title,
    private meta:Meta,
    private _AccountService:AccountService,
    private _AlumnoService: AlumnoService,
    private activatedRoute:ActivatedRoute,private _aspNetUserService:AspNetUserService) {


   }

   public Guid="";
   public datos: DatosFormularioDTO ={
    nombres:'',
    apellidos:'',
    email:'',
    idPais:undefined,
    idRegion:undefined,
    movil:'',
    idCargo:undefined,
    idAreaFormacion:undefined,
    idAreaTrabajo:undefined,
    idIndustria:undefined,
  }
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next:(x)=>{
          this.Guid=x["Guid"]
          this.AuthenticateATC();
      }
    })

  }
  AuthenticateATC(){
    this._aspNetUserService.AuthenticateATC(this.Guid).subscribe({
      next:(x)=>{
        console.log(x)
          // this.statuscharge=false
          this._SessionStorageService.SetToken(x.token)
          console.log('entra')
          this._AlumnoService.ObtenerCombosPerfil().subscribe({
            next: (x) => {
              this.datos.nombres = x.datosAlumno.nombres;
              this.datos.apellidos = x.datosAlumno.apellidos;
              this.datos.email = x.datosAlumno.email;
              this.datos.idPais = x.datosAlumno.idPais;
              this.datos.idRegion = x.datosAlumno.idDepartamento;
              this.datos.movil = x.datosAlumno.telefono;
              this.datos.idCargo = x.datosAlumno.idCargo;
              this.datos.idAreaFormacion = x.datosAlumno.idAreaFormacion;
              this.datos.idAreaTrabajo = x.datosAlumno.idAreaTrabajo;
              this.datos.idIndustria = x.datosAlumno.idIndustria

              this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
            }
          });
          console.log('sale')
          this.DatoObservable.datoAvatar=true
          this.DatoObservable.datoContenido=true
          this._HelperService.enviarDatoCuenta(this.DatoObservable)
          console.log(this.DatoObservable);
          this._SessionStorageService.SessionSetValue('IdProveedor',x.idProveedor);
          this._SessionStorageService.SessionSetValue('Cursos',x.cursos);
          this._SessionStorageService.SessionSetValue('TipoCarrera',x.tipoCarrera);
          var redirect=this._SessionStorageService.SessionGetValue('redirect');
          var normal=true;
          if(redirect!=''){
            if(redirect=='pago'){
              var jsonEnvioPago=this._SessionStorageService.SessionGetValue('datosTarjeta');
              if(jsonEnvioPago!=''){
                normal=false;
                this._FormaPagoService.PreProcesoPagoOrganicoAlumno(JSON.parse(jsonEnvioPago),null);
              }
            }
            this._SessionStorageService.SessionDeleteValue('redirect');
          }
          if(normal){
            var ap=this._SessionStorageService.SessionGetValueSesionStorage('accesoPrueba');
            if(ap==''){
              if(x.idProveedor==0){
                this.router.navigate(['/AulaVirtual/MisCursos']);
              }else{
                if(x.cursos==0){
                  this.router.navigate(['/AulaVirtual/Docencia']);
                }else{
                  this.router.navigate(['/AulaVirtual/MisCursos']);
                }
              }
            }else{
              this._AccountService.RegistroCursoAulaVirtualNueva(parseInt(ap)).subscribe({
                next:x=>{
                  this._SessionStorageService.SessionDeleteValueSesionStorage('accesoPrueba')
                  if(x.idProveedor==0){
                    this.router.navigate(['/AulaVirtual/MisCursos']);
                  }else{
                    if(x.cursos==0){
                      this.router.navigate(['/AulaVirtual/Docencia']);
                    }else{
                      this.router.navigate(['/AulaVirtual/MisCursos']);
                    }
                  }
                },
              })
            }
          }
      },error:e=>{
        console.log(e)
      }
    })

  }




}
