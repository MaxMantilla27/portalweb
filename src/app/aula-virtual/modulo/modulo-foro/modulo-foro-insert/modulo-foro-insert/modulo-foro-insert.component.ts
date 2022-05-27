import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ForoDTO } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';


@Component({
  selector: 'app-modulo-foro-insert',
  templateUrl: './modulo-foro-insert.component.html',
  styleUrls: ['./modulo-foro-insert.component.scss'],
})
export class ModuloForoInsertComponent implements OnInit {
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _ForoCursoService: ForoCursoService
  ) { this.userForm =fb.group({
    Titulo: ['', [Validators.required]],
    Contenido: ['', [Validators.required]],
  });
  }

  @Input() IdPprincipal=0;
  @Input() IdPgeneral=0;
  @Input() IdPEspecificoPadre=0;
  @Input() IdPEspecificoHijo=0;
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
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).subscribe({
      next: (x) => {
        console.log(x);
      },
    });
  }
}
