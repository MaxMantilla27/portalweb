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
  Renderer2,
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
import { InteraccionFormularioCampoDTO } from 'src/app/Core/Models/Interacciones';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';

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

  public changeValidation=false;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object,
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService,
    private renderer: Renderer2,
    private _SnackBarServiceService: SnackBarServiceService,


  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
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
  ListaLocalidades?: any;
  @Input()
  InputsDisable!: boolean;

  @Input()
  ChargeValuesInit: boolean=false;

  @Input()
  ObtenerPrefijo: boolean=false;

  @Input()
  CleanOnSubmit: boolean=false;

  @Input()
  Interaccion: any;

  @Output()
  OnSubmit: EventEmitter<object> = new EventEmitter<object>();

  @Output()
  OnValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  OnSelect: EventEmitter<Basic> = new EventEmitter<Basic>();
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('inputFieldRegion') inputFieldRegion!: ElementRef;
  @ViewChild('inputFieldLocalidad') inputFieldLocalidad!: ElementRef;
  public paise:Array<any>=[]
  public paisSelect=0;
  public pref=''
  public min=0
  public max=0
  @Input() cargando=false
  //later in the code
  fields: any = {};
  public interval:any
  public jsonForm:InteraccionFormularioCampoDTO={
    Acciones:[],
    AccionesJson:{},
    IdCategoriaOrigen:null,
    IdConjuntoAnuncio:null,
    IdInteraccionPortalPaginaV2:0,
    IdTipoInteraccionPortalFormulario:0,
    IdInteraccionPortalV2:0,
    Nombre:''
  }
  public flagLocalidadError = false;
  public localidadAux:any = '';
  ngOnInit(): void {
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(this.paise.length==0){
          this.paise=x;
          var codigoISo=this._SessionStorageService.SessionGetValue('ISO_PAIS');

          //this.paisSelect=this.paise.find(x=>x.codigoIso==codigoISo).idPais;
          var storageAlumno = this._SessionStorageService.SessionGetValue('DatosFormulario');
          if (storageAlumno == undefined || storageAlumno == null || storageAlumno == '') {
            this.paisSelect=this.paise.find(x=>x.codigoIso==codigoISo).idPais;
          }
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
        ////

        if (this.userForm == undefined){
          if (this.isBrowser) {
            let interval = setInterval(() => {
              if (this.userForm != undefined) {
                console.log(x)
               // if(this.paise.length==0){
                this.paise=x;
                var codigoISo=this._SessionStorageService.SessionGetValue('ISO_PAIS');
                //this.paisSelect=this.paise.find(x=>x.codigoIso==codigoISo).idPais;
                var storageAlumno = this._SessionStorageService.SessionGetValue('DatosFormulario');
                if (storageAlumno == undefined || storageAlumno == null || storageAlumno == '') {
                  this.paisSelect=this.paise.find(x=>x.codigoIso==codigoISo).idPais;
                }
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
                  this.OnValid.emit(this.userForm.valid);
                  if (this.localidadAux != '' && this.localidadAux != undefined) {
                    const fieldsArray = (this.userForm.get('Fields') as FormArray).controls;
                    const mobileIndex = fieldsArray.findIndex((element: any) => Object.keys(element?.value)[0] === 'Movil');
                    (<FormArray>this.userForm.get('Fields')).controls[mobileIndex].get("Movil")?.setValue(this.pref+this.localidadAux);


                  }
                  const fieldsArrayPais = (this.userForm.get('Fields') as FormArray).controls;
                  const mobileIndexPais = fieldsArrayPais.findIndex((element: any) => Object.keys(element?.value)[0] === 'IdPais');
                  (<FormArray>this.userForm.get('Fields')).controls[mobileIndexPais].get("IdPais")?.setValue(this.paisSelect);
                  index++
                })

                console.log('usuario formulario carga aqui',this.userForm)

              }
              clearInterval(interval);
            }, 1000);

          }
        }





        ////////7
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

      if(this.changeValidation==false){
        this.OnValid.emit(this.userForm.valid);
      }
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
    if (this.localidadAux != '' && this.localidadAux != undefined) {
      const fieldsArray = (this.userForm.get('Fields') as FormArray).controls;
      const mobileIndex = fieldsArray.findIndex((element: any) => Object.keys(element?.value)[0] === 'Movil');
      (<FormArray>this.userForm.get('Fields')).controls[mobileIndex].get("Movil")?.setValue(this.pref+this.localidadAux);


    }
    const fieldsArrayPais = (this.userForm.get('Fields') as FormArray).controls;
    const mobileIndexPais = fieldsArrayPais.findIndex((element: any) => Object.keys(element?.value)[0] === 'IdPais');
    (<FormArray>this.userForm.get('Fields')).controls[mobileIndexPais].get("IdPais")?.setValue(this.paisSelect);
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
      if(this.CleanOnSubmit==true){
        this.myNgForm.resetForm();
        var index=0
        this.fiels.forEach((f:any) =>{
          if(f.tipo=='phone' && this.userForm){
            this.validatePais(index,f.nombre)
          }
          index++
        })
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
      if(nombre == 'IdPais'){
        this.paisSelect = Number(value) == undefined ? this.paisSelect : Number(value);
        this.fiels[index].valorInicial = this.paisSelect;
      }
      else if (nombre == "IdLocalidad" && value != undefined){
        this.localidadAux = value;
      }
        if(fild.tipo=='select'){
        this.fiels[index].valorInicial = value;
        this.OnSelect.emit({Nombre:nombre,value:value});
      }
      else{
        this.fiels[index].valorInicial = value;
      }
      //this.fiels[index].valorInicial = value;
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
    let aux;
    for (let i = 0; i < (<FormArray>this.userForm.get('Fields')).length; i++) {
      const element = (<FormArray>this.userForm.get('Fields')).at(i);
      let clave = Object.keys(element.value);
      Object.entries(this.model).forEach(([key, value]) => {
        if (key == clave[0]) {
          value = element.value[clave[0]];
          obj[key] = value;
          if(this.ObtenerPrefijo==false){
            this.fiels.forEach((f:any) =>{
              if(f.tipo=='phone' && f.nombre.toLowerCase()==key.toLowerCase()){
                value = element.value[clave[0]].split(this.pref)[element.value[clave[0]].split(this.pref).length-1];
                obj[key] = value;
                aux= this.validadorPrefijo(this.pref, value);
                console.log("Valor del aux ",aux);
                if(aux!=''){
                  this._SnackBarServiceService.openSnackBar(
                    'El numero Ingresado no existe, Código LADA incorrecto.',
                    'x',
                    10,
                    'snackbarCrucigramaerror'
                  );
                  return;
                }
              }
            })
          }
        }
      });
    }
    this.model = obj;
    if(aux==''){
      this.OnSubmit.emit(this.model);
      if(this.CleanOnSubmit==true){
        //this.userForm.reset();
      }
      if(this.Interaccion!=undefined){
        this.EnvioInteraccion(true);
      }
    }

  }
  ClickIntoForm(){
    if(this.interval==undefined){
      var i = 0;
      this.interval=setInterval(()=>{
        i++;
        if(i==60){
          this.EnvioInteraccion(false);
        }
      },1000);
    }
  }
  EnvioInteraccion(enviado:boolean){
    let objInteraccion:Array<any>=[];
    for (let i = 0; i < (<FormArray>this.userForm.get('Fields')).length; i++) {
      const element = (<FormArray>this.userForm.get('Fields')).at(i);
      let clave = Object.keys(element.value);
      var value = element.value[clave[0]];
      if(this.ObtenerPrefijo==false){
        this.fiels.forEach((f:any) =>{
          if(f.tipo=='phone' && f.nombre.toLowerCase()==clave[0].toLowerCase()){
            value = element.value[clave[0]].split(this.pref)[element.value[clave[0]].split(this.pref).length-1];
          }
        })
      }
      this.fiels.forEach((f:any) =>{
        if(f.nombre.toLowerCase()==clave[0].toLowerCase()){

          var tipo='Input'
          if(f.tipo=='checkbox'){
            tipo='checkbox'
          }
          if(f.tipo.toLowerCase()=='password'){
            let cantV=value.length
            let v=''
            for(let i=0; i<cantV;i++){
              v+='*'
            }
            value=v;
          }
          objInteraccion.push({
            Tag:tipo,
            Tipo:f.tipo,
            Nombre:f.label,
            valor:value
          })
        }
      })
    }
    var tipo=0;
    if(enviado){
      if(this.userForm.valid==true){
        tipo=4
      }else{
        tipo=3
      }
    }else{
      if(this.userForm.valid==true){
        tipo=2
      }else{
        tipo=1
      }
    }
    this.jsonForm.AccionesJson=objInteraccion;
    this.jsonForm.IdCategoriaOrigen=this._SessionStorageService.SessionGetValueCokies("idCategoria");
    this.jsonForm.IdConjuntoAnuncio=this._SessionStorageService.SessionGetValueCokies("idCampania")
    this.jsonForm.IdTipoInteraccionPortalFormulario=tipo
    this.jsonForm.Nombre=this.Interaccion
    this._HelperService.enviarMsjForm(this.jsonForm);
    clearInterval(this.interval)
    this.interval=undefined
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
      var fls=this.fiels.find(x=>x.nombre==val);
      if(fls?.tipo=='phone'){
        return 'La longitud debe ser de '+(this.min) +' dígitos minimo'
      }
      return 'La longitud es incorrecta';
    }
    if (campo!.hasError('maxlength')) {
      let max = campo?.getError('maxlength')!.requiredLength;
      //return 'La longitud maxima es de ' + max + ' caracteres';
      var fls=this.fiels.find(x=>x.nombre==val);
      if(fls?.tipo=='phone'){
        return 'La longitud debe ser de '+(this.max) +' dígitos maximo'
      }
      return 'La longitud es incorrecta';
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
    var c=(<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.value;
    var campo =c==null?'':c.toString();
    var s=campo.split(' ');
    if(s.length ==1){
      s.push(' ')
    }

    this.pref=this.PrefPaises()==null?'':this.PrefPaises()+' ';
    this.min=this.LongCelularPaises()==null?0:this.LongCelularPaises();
    (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.pref);
    //(<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.pref+s.slice(1));
    (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.clearValidators();
    if(this.min>0){
      this.max=this.MaxLongCelularPaises()==null?0:this.MaxLongCelularPaises();

      if(this.min>0){
        (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.addValidators([
          Validators.required,
          Validators.minLength(this.pref.length+this.min),
          Validators.maxLength(this.pref.length+this.max)]);
        this.ChangeInpiut(i,val);
        this.OnValid.emit(false);
      }else{
        (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.addValidators([
          Validators.required,
          Validators.minLength(this.pref.length+this.min),
          Validators.maxLength(this.pref.length+this.min)]);
        this.ChangeInpiut(i,val);
        this.OnValid.emit(false);
      }
    }else{
      (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.addValidators([
        Validators.required]);
      this.OnValid.emit(false);
    }
    (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.pref);
    //(<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.pref+(s.length>1?s[1]:''));

  }
  LongCelularPaises():number{
    if(this.paise.find(x=>x.idPais==this.paisSelect)!=undefined){
      return this.paise.find(x=>x.idPais==this.paisSelect).longCelularAlterno
    }
    return 0;
  }
  MaxLongCelularPaises():number{
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
    if(s.length ==1){
      s.push(' ')
    }
    console.log(s)
    this.validadorPrefijo(s[0],s[1]);
    if(this.PrefPaises()!=null){
      if(s[0]!=this.PrefPaises()){
        if(s[0].length>this.PrefPaises().length){
          (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(
              s[0].slice(0,this.PrefPaises().length)+' '+campo.slice(this.PrefPaises().length)
          );
          console.log(1)
        }else{
          (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.PrefPaises()+' ');
          console.log(2)
        }
      } else if(campo==this.PrefPaises()){
        (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(this.PrefPaises()+' ');
        console.log(3)
      }else{
        (<FormArray>this.userForm.get('Fields')).controls[i].get(val)?.setValue(
            s[0].slice(0,this.PrefPaises().length)+' '+s[1].trim()
        );
      }
    }
  }
  changeselectForm(nombre:any, value:any){
    this.OnSelect.emit({Nombre:nombre,value:value});
    if (nombre == 'IdPais') {
      this.paisSelect = value;
      /*Se encuentra el index del campo movil*/
      const fieldsArray = (this.userForm.get('Fields') as FormArray).controls;
      const mobileIndex = fieldsArray.findIndex((element: any) => Object.keys(element?.value)[0] === 'Movil');
      this.validatePais(mobileIndex,'Movil');

    }
    if (nombre == 'IdLocalidad' && value != undefined) {
      const fieldsArray = (this.userForm.get('Fields') as FormArray).controls;
      const mobileIndex = fieldsArray.findIndex((element: any) => Object.keys(element?.value)[0] === 'Movil');
      (<FormArray>this.userForm.get('Fields')).controls[mobileIndex].get("Movil")?.setValue(this.pref+value);
      // console.log("Valor localidad ",value)
    }
    this.fiels.forEach((element: any) => {
      if(element.nombre == nombre){
        element.filteredOptions = element.filteredOptionsAux;
      }
    });
  }
  onOpenedChange(event:any, field:any) {
    this.focusInput();
  }
  onSelectOpenedChange(field: any) {
    if(field.nombre == 'IdPais'){
      this.renderer.selectRootElement(this.inputField.nativeElement).focus();

    }
    if(field.nombre == 'IdRegion'){
      this.renderer.selectRootElement(this.inputFieldRegion.nativeElement).focus();

    }
    if(field.nombre == 'IdLocalidad'){
      this.renderer.selectRootElement(this.inputFieldLocalidad.nativeElement).focus();

    }

  }
  onKey(evetn:any, field:any) {
    const searchText = evetn.target.value == null ? '' : evetn.target.value.toLowerCase();
    this.fiels.forEach((element: any) => {
      if(element.nombre == field.nombre){
        element.filteredOptions = field.filteredOptionsAux.filter((option:any) =>
          option.Nombre.toLowerCase().includes(searchText)
        );
      }
    });
  }
  focusInput() {
    // if (this.inputField && this.inputField.nativeElement) {
    //   this.renderer.selectRootElement(this.inputField.nativeElement).focus();
    // }
    this.renderer.selectRootElement(this.inputField.nativeElement).focus();

  }
  validadorPrefijo(codigoPais:string, nrocelular:string ){
    codigoPais = codigoPais.trim();
    if(codigoPais == '+52' && nrocelular.length >= 2){
      const primerosDosDigitos = nrocelular.substring(0, 2);
      const primerosTresDigitos = nrocelular.substring(0, 3);
      if (
        !this.ListaLocalidades?.includes(primerosDosDigitos) &&
        !this.ListaLocalidades?.includes(primerosTresDigitos)
      ) {
        this.flagLocalidadError = true;
        console.log("Error el prefijo no es valido");
        return "Error la clave LADA no es valida"
      }
      else{
        console.log("El prefijo es valido");
        this.flagLocalidadError = false;
        return ""
      }

    }
    return ""
  }
}
