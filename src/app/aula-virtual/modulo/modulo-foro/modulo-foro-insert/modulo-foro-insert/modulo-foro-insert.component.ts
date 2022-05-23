import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForoDTO } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-modulo-foro-insert',
  templateUrl: './modulo-foro-insert.component.html',
  styleUrls: ['./modulo-foro-insert.component.scss']
})
export class ModuloForoInsertComponent implements OnInit {

  constructor(
    private _ForoCursoService: ForoCursoService
  ) { }
  @Input() IdPgeneral=0;
  public ForoCurso: ForoDTO ={
    idPrincipal:0,
    idCurso: 0,
    idPEspecificoPadre: 0,
    idPEspecificoHijo: 0,
    titulo: '',
    contenido: ''
  }
  public userForm :FormGroup=new FormGroup({
    titulo: new FormControl(Validators.required),
    contenido: new FormControl(Validators.required),
  });
    
  ngOnInit(): void {
    
  }
  InsertarForo(){
    this.ForoCurso.idPrincipal = 587
    this.ForoCurso.idCurso = this.IdPgeneral;
    this.ForoCurso.idPEspecificoPadre = 14217
    this.ForoCurso.idPEspecificoHijo = 14217
    this.ForoCurso.titulo =this.userForm.get('Titulo')?.value;
    this.ForoCurso.contenido = this.userForm.get('Contenido')?.value;;
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).subscribe({
      next: (x) => {
        console.log(x);
      },
    });
  }
}
