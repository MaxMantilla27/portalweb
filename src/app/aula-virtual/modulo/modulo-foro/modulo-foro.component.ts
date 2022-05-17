import { Component, Input, OnInit } from '@angular/core';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-modulo-foro',
  templateUrl: './modulo-foro.component.html',
  styleUrls: ['./modulo-foro.component.scss']
})
export class ModuloForoComponent implements OnInit {

  constructor(
    private _ForoCursoService:ForoCursoService,
    private _AvatarService:AvatarService
  ) { }

  @Input() IdPgeneral=0
  @Input() Capitulo='';
  public foro:Array<any>=[]
  public paginacion=[1]
  public pagina=1;
  ngOnInit(): void {
    this.ObtenerForoCurso();
  }
  ObtenerForoCurso(){
    this._ForoCursoService.ObtenerForoCurso(this.IdPgeneral).subscribe({
      next:x=>{
        console.log(x)
        this.foro=x
        this.foro.forEach(x=>{
          x.urlAvatar=this._AvatarService.GetUrlImagenAvatar(x.avatar)
        })
        var pag=Math.ceil(this.foro.length/4)
        this.paginacion=[]
        for (let index = 0; index < pag; index++) {
          this.paginacion.push(index+1);
        }
      }
    })
  }

}
