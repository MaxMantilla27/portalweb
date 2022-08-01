import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ForoDTO } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';


@Component({
  selector: 'app-modulo-foro-insert',
  templateUrl: './modulo-foro-insert.component.html',
  styleUrls: ['./modulo-foro-insert.component.scss'],
})
export class ModuloForoInsertComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _ForoCursoService: ForoCursoService
  ) { this.userForm =fb.group({
    Titulo: ['', [Validators.required]],
    Contenido: ['', [Validators.required]],
  });
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() valorNavegacionForo=-1;
  @Input() IdPprincipal=0;
  @Input() IdPgeneral=0;
  @Input() IdPEspecificoPadre=0;
  @Input() IdPEspecificoHijo=0;
  @Output() volver:EventEmitter<void>=new EventEmitter<void>();
  public NuevoForo =false;
  public AnadirForo =false;
  public ForoCurso: ForoDTO ={
    idPrincipal:0,
    idCurso: 0,
    idPEspecificoPadre: 0,
    idPEspecificoHijo: 0,
    titulo: '',
    contenido: ''
  }
  ngOnInit(): void {

  }
  InsertarForo(){
    this.ForoCurso.idPrincipal = this.IdPprincipal;
    this.ForoCurso.idCurso = this.IdPgeneral;
    this.ForoCurso.idPEspecificoPadre = this.IdPEspecificoPadre;
    this.ForoCurso.idPEspecificoHijo = this.IdPEspecificoHijo;
    this.ForoCurso.titulo =this.userForm.get('Titulo')?.value;
    this.ForoCurso.contenido = this.userForm.get('Contenido')?.value;
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        this.VolverAtras();
      },
    });
  }
  VolverAtras(){
    this.volver.emit()
  }
}
