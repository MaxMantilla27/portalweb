import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormularioComponent implements OnChanges, OnInit,OnDestroy {
  private signal$ = new Subject();
  @ViewChild('f') myNgForm: any;
  isBrowser: boolean;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object,
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService

  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
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


  @Input()
  CleanOnSubmit: boolean=false;

  @Output()
  OnSubmit: EventEmitter<object> = new EventEmitter<object>();

  @Output()
  OnValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  OnSelect: EventEmitter<Basic> = new EventEmitter<Basic>();

  public paise:Array<any>=[]
  public paisSelect=0;
  public pref=''
  public min=0
  //later in the code
  fields: any = {};
  ngOnInit(): void {
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(this.paise.length==0){
          this.paise=x;
          var codigoISo=this._SessionStorageService.SessionGetValue('ISO_PAIS');
          this.paisSelect=this.paise.find(x=>x.codigoIso==codigoISo).idPais;
          var index=0
          this.fiels.forEach((f:any) =>{
            if(f.tipo=='phone' && this.userForm){
              this.validatePais(index,f.nombre)
            }
            if(f.nombre.toLowerCase()=='idpais' && this.userForm){
              let campo = (<FormArray>this.userForm.get('Fields')).controls[index].get(f.nombre);
              if(campo?.value!=undefined){
                campo?.setValue(this.paisSelect);
                this.OnSelect.emit({Nombre:f.nombre,value:this.paisSelect})
              }
            }
            index++
          })
        }
      }
    })
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

    this.userForm.valueChanges.pipe(takeUntil(this.signal$)).subscribe(() => {
      this.OnValid.emit(this.userForm.valid);
    });
    this.fiels.forEach((x:any) =>{
      if(x.disable!=undefined && x.disable==true){
        this.disableFiled(x.nombre)
      }
    })
    var index=0;
    this.fiels.forEach((f:any) =>{
      if(f.tipo=='phone' && this.userForm){
        this.validatePais(index,f.nombre)
      }
      index++;
    });
    this.OnValid.emit(this.userForm.valid);
  }
  changeForm(){
    if(this.userForm!=undefined){
      for (let i = 0; i < this.fiels.length; i++) {
        let campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(
          this.fiels[i].nombre
        );
        //campo?.setValue(this.fiels[i].valorInicial);
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
          this.fiels.forEach((f:any) =>{
            if(f.tipo=='phone' && f.nombre.toLowerCase()==key.toLowerCase()){
              value = element.value[clave[0]].split(this.pref)[element.value[clave[0]].split(this.pref).length-1];
              obj[key] = value;
            }
          })
        }
      });
    }
    this.model = obj;
    this.OnSubmit.emit(this.model);
    if(this.CleanOnSubmit==true){
      this.myNgForm.resetForm();
      //this.userForm.reset();
    }
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
      var fls=this.fiels.find(x=>x.nombre==val);
      if(fls?.error!=undefined){
        return fls?.error;
      }
      return 'El campo ' + this.fiels[i].label + ' es requerido';
    }

    if (campo!.hasError('minlength')) {
      let min = campo?.getError('minlength')!.requiredLength;
      //return 'La longitud mínima es de ' + min + ' caracteres';
      return 'La longitud es incorecta';
    }
    if (campo!.hasError('maxlength')) {
      let max = campo?.getError('maxlength')!.requiredLength;
      //return 'La longitud maxima es de ' + max + ' caracteres';
      return 'La longitud es incorecta';
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
  IconPaises(){
    if(this.paise.find(x=>x.idPais==this.paisSelect)!=undefined){
      return this.paise.find(x=>x.idPais==this.paisSelect).icono
    }
    return '';
  }
  validatePais(i: number, val: string){
    var campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.value.toString();
    var s=campo.split(' ');

    this.pref=this.PrefPaises()==null?'':this.PrefPaises()+' ';
    console.log((<FormArray>this.userForm.get('Fields')).controls[i])
    console.log(this.pref+s.slice(1))
    console.log(campo)
    this.min=this.LongCelularPaises()==null?0:this.LongCelularPaises();
    (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.pref+s.slice(1));
    console.log((<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.value.toString());
    (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.clearValidators();
    if(this.min>0){
      (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.addValidators([
        Validators.required,
        Validators.minLength(this.pref.length+this.min),
        Validators.maxLength(this.pref.length+this.min)]);
    }else{

      (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.addValidators([
        Validators.required]);
    }
  }
  LongCelularPaises():number{
    if(this.paise.find(x=>x.idPais==this.paisSelect)!=undefined){
      return this.paise.find(x=>x.idPais==this.paisSelect).longCelular
    }
    return 0;
  }
  PrefPaises():string{
    if(this.paise.find(x=>x.idPais==this.paisSelect)!=undefined){
      return this.paise.find(x=>x.idPais==this.paisSelect).prefijoTelefono
    }
    return '';
  }
  ChangeInpiut(i: number, val: string){
    var campo = (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.value.toString();
    var s =campo.split(' ')
    if(this.PrefPaises()!=null){
      if(s[0]!=this.PrefPaises()){
        if(s[0].length>this.PrefPaises().length){
          (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(s[0].slice(0,this.PrefPaises().length)+' '+campo.slice(this.PrefPaises().length));
        }else{
          (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.PrefPaises()+' ');
        }
      } else if(campo==this.PrefPaises()){
        (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.PrefPaises()+' ');
      }
    }
  }
}
