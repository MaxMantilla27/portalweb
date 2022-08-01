import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-modulo-foro',
  templateUrl: './modulo-foro.component.html',
  styleUrls: ['./modulo-foro.component.scss'],
})
export class ModuloForoComponent implements OnInit, OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _ForoCursoService: ForoCursoService,
    private _AvatarService: AvatarService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdPgeneral = 0;
  @Input() IdPprincipal = 0;
  @Input() IdPEspecificoPadre = 0;
  @Input() IdPEspecificoHijo = 0;
  @Input() Capitulo = '';
  public valorNavegarForoPrincipal=0;
  public NuevoForo=false;
  public ContenidoForo=false;
  public IdForo=0;
  public foro: Array<any> = [];
  public paginacion = [1];
  public pagina = 1;
  public paginaCeil = Math.ceil(this.pagina / 5);
  ngOnInit(

  ): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPgeneral != 0 && this.valorNavegarForoPrincipal==0) {
      this.ObtenerForoCurso();
    }
  }
  ObtenerForoCurso() {
    this._ForoCursoService.ObtenerForoCurso(this.IdPgeneral).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {

        console.log(x);
        this.foro = x;
        if (this.foro != null && this.foro != undefined) {
          this.foro.forEach((x) => {
            x.urlAvatar = this._AvatarService.GetUrlImagenAvatar(x.avatar);
          });
          var pag = Math.ceil(this.foro.length / 4);
          this.paginacion = [];
          for (let index = 0; index < pag; index++) {
            this.paginacion.push(index + 1);
          }
        }
      },
    });
  }
  minusPage() {
    if (this.pagina > 1) {
      this.pagina--;
      this.paginaCeil = Math.ceil(this.pagina / 5);
    }
  }
  plusPage() {
    if(this.foro!=null){
      if (this.pagina < Math.ceil(this.foro.length / 4)) {
        this.pagina++;
        this.paginaCeil = Math.ceil(this.pagina / 5);
      }
    }
  }
  page(p: number) {
    this.pagina = p;
    this.paginaCeil = Math.ceil(this.pagina / 5);
  }
  RefrescarForo(){
    this.NuevoForo=false;
    this.ContenidoForo=false;
    this.ObtenerForoCurso() ;
  }
}
