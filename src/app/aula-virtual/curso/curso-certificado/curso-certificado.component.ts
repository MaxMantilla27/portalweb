import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { DatosAlumnoValidacionDTO } from 'src/app/Core/Models/CertificadoDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-curso-certificado',
  templateUrl: './curso-certificado.component.html',
  styleUrls: ['./curso-certificado.component.scss']
})
export class CursoCertificadoComponent implements OnInit,OnChanges {

  constructor(
    private _CertificadoService:CertificadoService,
    private _HelperService:HelperService
  ) { }
  @Input() idProyecto:any;
  @Input() idPGeneral=0;;
  @Input() idPEspecifico=0;
  @Input() datosCertificado:any;
  @Input() curso:any;
  @Input() alertaDigital=false;
  @Input() alertaFisico=false;
  public json:DatosAlumnoValidacionDTO={
    Nombres:'',
    Apellidos:''
  }

  public errorRegister = '';
  statuscharge = false;
  initValues=false;
  formVal: boolean = false;
  fileds: Array<formulario> = [];
  public miPerfil:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x:any) => {
      this.json.Nombres=x.datosAlumno.nombres
      this.json.Apellidos=x.datosAlumno.apellidos
      console.log(this.json)
      this.miPerfil=x
      console.log(this.miPerfil)
      this.AddField()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  InsertarValidacionDatosAlumno(e:any){
    console.log(e)
    this.json.Nombres=e.Nombres
    this.json.Apellidos=e.Apellidos
    this._CertificadoService.InsertarValidacionDatosAlumno(this.json).subscribe({
      next:x=>{
        console.log(x)
      }
    })
  }

  AddField() {
    console.log(this.miPerfil.datosAlumno.nombres)
    this.fileds.push({
      nombre: 'Nombres',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Nombres',
    });
    this.fileds.push({
      nombre: 'Apellidos',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Apellidos',
    });
  }
}
