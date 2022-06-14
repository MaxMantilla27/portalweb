import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO } from 'src/app/Core/Models/FormularioDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { ContactenosService } from 'src/app/Core/Shared/Services/Contactenos/contactenos.service';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.scss']
})
export class ContactenosComponent implements OnInit {

  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private _DatosPortalService:DatosPortalService,
    private _RegionService:RegionService,
    private _ContactenosService:ContactenosService,
    ) { }

  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Contáctanos',
      urlWeb: '/contactenos'
    }
  ]
  public expancion=[false,false,false,false,false]
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
    IdCargo:0,
    IdAreaFormacion:0,
    IdAreaTrabajo:0,
    IdIndustria:0,
    Comentario:''
  }
  public DatosContactenosEnvio: ContactenosDTO={
    Nombres:'',
    Apellidos:'',
    Correo1:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
    IdCargo:0,
    IdAreaFormacion:0,
    IdAreaTrabajo:0,
    IdIndustria:0,
    Comentario:'',
  }
  ngOnInit(): void {
    this.AddFields();
    this.ObtenerCombosPortal();
  }
  SetContacto(value:any){
    this.initValues = false;
    this.DatosContactenosEnvio.Nombres=value.Nombres;
    this.DatosContactenosEnvio.Apellidos=value.Apellidos;
    this.DatosContactenosEnvio.Correo1=value.Email;
    this.DatosContactenosEnvio.IdPais=value.IdPais;
    this.DatosContactenosEnvio.IdRegion=value.IdRegion;
    this.DatosContactenosEnvio.Movil=value.Movil;
    this.DatosContactenosEnvio.IdCargo=value.IdCargo;
    this.DatosContactenosEnvio.IdAreaFormacion=value.IdAreaFormacion;
    this.DatosContactenosEnvio.IdAreaTrabajo=value.IdAreaTrabajo;
    this.DatosContactenosEnvio.IdIndustria=value.IdIndustria;
    this.DatosContactenosEnvio.Comentario=value.Comentario;
    console.log(this.DatosContactenosEnvio)
    this._ContactenosService.EnviarFormulario(this.DatosContactenosEnvio).subscribe({
      next: (x) => {
        console.log(x);
      },
      complete: () => {
        this.statuscharge = false;
      },
    });
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().subscribe({
      next:(x)=>{
        console.log(x);
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data=x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdCargo'){
            r.data=x.listaCargo.map((p:any)=>{
              var ps:Basic={Nombre:p.cargo,value:p.idCargo};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaFormacion'){
            r.data=x.listaAreaFormacion.map((p:any)=>{
              var ps:Basic={Nombre:p.areaFormacion,value:p.idAreaFormacion};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaTrabajo'){
            r.data=x.listaAreaTrabajo.map((p:any)=>{
              var ps:Basic={Nombre:p.areaTrabajo,value:p.idAreaTrabajo};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdIndustria'){
            r.data=x.listaIndustria.map((p:any)=>{
              var ps:Basic={Nombre:p.industria,value:p.idIndustria};
              return ps;
            })
          }
        })
      }
    })
    this.initValues = true;
  }
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).subscribe({
      next:x=>{
        this.fileds.forEach(r=>{
          if(r.nombre=='IdRegion'){
            r.disable=false;
            r.data=x.map((p:any)=>{
              var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
              return ps;
            })
          }
        })
        this.form.enablefield('IdRegion');
      }
    })
  }
  SelectChage(e:any){
    if(e.Nombre=="IdPais"){
      this.GetRegionesPorPais(e.value)
    }
  }
  AddFields(){

    this.fileds.push({
      nombre:"Nombres",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Nombres",
    });
    this.fileds.push({
      nombre:"Apellidos",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Apellidos",

    });
    this.fileds.push({
      nombre:"Email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"E-mail",

    });
    this.fileds.push({
      nombre:"IdPais",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"País",
    });
    this.fileds.push({
      nombre:"IdRegion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      disable:true,
      label:"Región",
    });
    this.fileds.push({
      nombre:"Movil",
      tipo:"phone",
      valorInicial:"",
      validate:[Validators.required],
      label:"Teléfono Móvil",
    });
    this.fileds.push({
      nombre:"IdCargo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Cargo",
    });
    this.fileds.push({
      nombre:"IdAreaFormacion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área de Formación",
    });
    this.fileds.push({
      nombre:"IdAreaTrabajo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área de Trabajo",
    });
    this.fileds.push({
      nombre:"IdIndustria",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Industria",
    });
    this.fileds.push({
      nombre:"Comentario",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Comentario",
    });
  }
}
