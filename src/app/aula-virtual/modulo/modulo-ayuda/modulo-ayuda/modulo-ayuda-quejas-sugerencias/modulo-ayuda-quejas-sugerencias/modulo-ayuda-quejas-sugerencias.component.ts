import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject,takeUntil } from 'rxjs';
import { QuejaSugerenciaDTO } from 'src/app/Core/Models/QuejaSugerenciaDTO';
import { QuejaSugerenciaService } from 'src/app/Core/Shared/Services/QuejaSugerencia/queja-sugerencia.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-modulo-ayuda-quejas-sugerencias',
  templateUrl: './modulo-ayuda-quejas-sugerencias.component.html',
  styleUrls: ['./modulo-ayuda-quejas-sugerencias.component.scss']
})
export class ModuloAyudaQuejasSugerenciasComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _QuejaSugerenciaService:QuejaSugerenciaService,
    private _SnackBarServiceService:SnackBarServiceService
  ){ this.userForm =fb.group({
    IdTipoQuejaSugerencia: ['', [Validators.required]],
    Descripcion: ['', [Validators.required]],
  });
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() IdPGeneral=0
  @Input() IdPEspecifico=0
  @Input() Capitulo=''
  @Output() volver:EventEmitter<void>=new EventEmitter<void>();

  public Tipo:any;
  public RegistroQuejaSugerencia:QuejaSugerenciaDTO={
    idTipoQuejaSugerencia:0,
    descripcion:'',
    idPGeneral:0,
    idPEspecifico:0
  }
  ngOnInit(): void {
    this.ObtenerTipoQuejaSugerencia()
  }

  ObtenerTipoQuejaSugerencia(){
    this._QuejaSugerenciaService.ObtenerTipoQuejaSugerencia().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.Tipo=x
      }
    })
  }
  RegistrarQuejaSugerencia(){
    this.RegistroQuejaSugerencia.idTipoQuejaSugerencia=this.userForm.get('IdTipoQuejaSugerencia')?.value;
    this.RegistroQuejaSugerencia.descripcion=this.userForm.get('Descripcion')?.value;
    this.RegistroQuejaSugerencia.idPGeneral=this.IdPGeneral
    this.RegistroQuejaSugerencia.idPEspecifico=this.IdPEspecifico
    console.log(this.RegistroQuejaSugerencia)
    this._QuejaSugerenciaService.RegistrarPortalQuejaSugerencia(this.RegistroQuejaSugerencia).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        var nametipo=this.Tipo.find((x:any)=>x.id==this.RegistroQuejaSugerencia.idTipoQuejaSugerencia).nombre
        this.userForm.reset()
        this._SnackBarServiceService.openSnackBar("La "+nametipo+' se registró correctamente','x',5,"snackbarCrucigramaSucces");
        //this.VolverAtras();
      },
    })
  }
  VolverAtras(){
    this.volver.emit()
  }
}
