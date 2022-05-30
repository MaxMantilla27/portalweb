import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { formulario } from 'src/app/Core/Models/Formulario';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormularioComponent implements OnChanges, OnInit {
  isBrowser: boolean;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  userForm!: FormGroup;

  @Input()
  FormOld: boolean = true;

  @Input()
  Tipo: number = 1;

  @Input()
  Color: string = '';

  @Input()
  fiels!: Array<formulario>;

  @Input()
  model!: object;

  @Input()
  InputsDisable!: boolean;

  @Input()
  ChargeValuesInit: boolean=false;

  @Output()
  OnSubmit: EventEmitter<object> = new EventEmitter<object>();

  @Output()
  OnValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  OnSelect: EventEmitter<Basic> = new EventEmitter<Basic>();


  //later in the code
  fields: any = {};
  ngOnInit(): void {
    if(this.isBrowser){
      if(this.Color!=''){
        document.documentElement.style.setProperty('--main-bg-color',this.Color);
      }
    }
    let i = 0;
    Object.entries(this.model).forEach(([key, value]) => {
      this.AddFields(key, value, i);
      i++;
    });
    this.userForm = this.formBuilder.group({
      Fields: this.formBuilder.array([]),
    });
    this.AddItemsForm();

    this.userForm.valueChanges.subscribe(() => {
      this.OnValid.emit(this.userForm.valid);
    });
    this.fiels.forEach((x:any) =>{
      if(x.disable!=undefined && x.disable==true){
        this.disableFiled(x.nombre)
      }
    })

    this.OnValid.emit(this.userForm.valid);
  }
  changeForm(){
    console.log(this.userForm)
    if(this.userForm!=undefined){
      console.log(this.fiels)
      for (let i = 0; i < this.fiels.length; i++) {
        let campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(
          this.fiels[i].nombre
        );
        campo?.setValue(this.fiels[i].valorInicial);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeForm();
    if (this.userForm != undefined) {
      if (this.InputsDisable == true) {
        this.DisabledFields();
      } else {
        this.EnabledFields();
      }
    }
  }
  AddItemsForm() {
    const control = <FormArray>this.userForm.get('Fields');
    for (let values of this.fiels) {
      let obj: any = {};
      let val: any = {};
      val['validators'] = values.validate;
      let name = [values.valorInicial, val];
      obj[values.nombre] = name;
      control.push(this.patchValues(obj));
    }
  }
  patchValues(obj: any) {
    return this.formBuilder.group(obj);
  }
  AddFields(nombre: string, value: string, index: number) {
    let fild = this.fiels.find((x) => x.nombre === nombre);
    if (fild != undefined) {
      let index = this.fiels.indexOf(fild);

      this.fiels[index].valorInicial = value;
    } else {
      this.fiels.splice(index, 0, {
        nombre: nombre,
        tipo: 'text',
        valorInicial: value,
        validate: [],
        label: nombre,
      });
    }
  }
  EnviarCambios() {
    let obj: any = {};
    for (let i = 0; i < (<FormArray>this.userForm.get('Fields')).length; i++) {
      const element = (<FormArray>this.userForm.get('Fields')).at(i);
      let clave = Object.keys(element.value);
      Object.entries(this.model).forEach(([key, value]) => {
        if (key == clave[0]) {
          value = element.value[clave[0]];
          obj[key] = value;
        }
      });
    }
    this.model = obj;
    this.OnSubmit.emit(this.model);
    //this.userForm.reset();
  }

  disableFiled(name:string){

    for (let i = 0; i < this.fiels.length; i++) {
      let campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(name);
      campo?.disable();
    }
  }
  enablefield(name:string){
    for (let i = 0; i < this.fiels.length; i++) {
      let campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(name);
      campo?.enable();
    }
  }
  DisabledFields() {
    for (let i = 0; i < this.fiels.length; i++) {
      let campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(
        this.fiels[i].nombre
      );
      campo?.disable();
    }
  }
  EnabledFields() {
    for (let i = 0; i < this.fiels.length; i++) {
      let campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(
        this.fiels[i].nombre
      );
      campo?.enable();
    }
  }
  obtenerErrorCampoNombre(i: number, val: string) {
    var campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(val);
    if (campo!.hasError('required')) {
      return 'El campo ' + this.fiels[i].label + ' es requerido';
    }

    if (campo!.hasError('minlength')) {
      let min = campo?.getError('minlength')!.requiredLength;
      return 'La longitud mínima es de ' + min + ' caracteres';
    }
    if (campo!.hasError('maxlength')) {
      let max = campo?.getError('maxlength')!.requiredLength;
      return 'La longitud maxima es de ' + max + ' caracteres';
    }
    if (campo!.hasError('min')) {
      let min = campo?.getError('min')!.min;
      return 'El valor mínimo es :' + min;
    }
    if (campo!.hasError('max')) {
      let max = campo?.getError('max')!.max;
      return 'El valor maximo es :' + max;
    }
    if (campo!.hasError('email')) {
      return 'El campo tiene que ser un correo (example@example.com)';
    }
    return '';
  }
  Fields(): FormArray {
    return this.userForm.get('Fields') as FormArray;
  }
}
