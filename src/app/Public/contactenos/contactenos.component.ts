import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO } from 'src/app/Core/Models/FormularioDTO';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.scss']
})
export class ContactenosComponent implements OnInit {

  constructor() { }

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

  statuscharge = false;
  formVal: boolean = false;

  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
    IdCargo:undefined,
    IdAreaFormacion:undefined,
    IdAreaTrabajo:undefined,
    IdIndustria:undefined,
  }
  ngOnInit(): void {
    this.AddFields();
  }
  SetContacto(e:any){
    console.log(e);
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
      label:"Pais",
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
      tipo:"text",
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
      label:"Área Formación",
    });
    this.fileds.push({
      nombre:"IdAreaTrabajo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área Trabajo",
    });
    this.fileds.push({
      nombre:"IdIndustria",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Industria",
    });
  }
}
