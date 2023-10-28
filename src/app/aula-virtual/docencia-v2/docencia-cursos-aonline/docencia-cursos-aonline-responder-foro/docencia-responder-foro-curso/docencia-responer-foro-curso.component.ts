import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { Subject, takeUntil } from 'rxjs';
import { DocenciaResponderForoCursoModalComponent } from '../docencia-responder-foro-curso-modal/docencia-responder-foro-curso-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-docencia-responer-foro-curso',
  templateUrl: './docencia-responer-foro-curso.component.html',
  styleUrls: ['./docencia-responer-foro-curso.component.scss']
})
export class DocenciaResponerForoCursoComponent implements OnInit, OnChanges , OnDestroy {

  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  columnHeader = {
    'codigoMatricula'  : 'Código',
    'nombreAlumno': 'Nombre Alumno',
    'titulo': 'Tema Foro',
    'fechaPublicacion': 'Fecha Publicación',
    'fechaRespuesta': 'Fecha Respuesta',
    'estadoForo': 'Estado',
    'Acciones': 'Acciones',
  };

  TipoContenido:any={
    FechaPublicacion: ['date'],
    FechaRespuesta: ['date'],
    titulo:['temaForo','titulo'],
    'Acciones': ['buttons','Responder']
  }
  constructor(
    private _ForoCursoService: ForoCursoService,
    public dialog: MatDialog,
  ) { }

  @Input() IdPGeneral = 0;
  @Output() OnRecharge = new EventEmitter<void>();
  public foroCurso: any;
  public NombreCurso=''
  public RegresarAhora=false;
  public TerminaCarga=false;
  ngOnInit(): void {
    this.RegresarAhora=false
    this.TerminaCarga=false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.RegresarAhora=false
    this.TerminaCarga=false;
    if(this.IdPGeneral>0){
      this.ObtenerForosPorCursoDocente()
    }
  }
  ObtenerForosPorCursoDocente() {
    var datePipe = new DatePipe('en-US');
    this._ForoCursoService
      .ObtenerForosPorCursoDocente(this.IdPGeneral)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.TerminaCarga=true;
          this.foroCurso = x;
          if(this.foroCurso!=null || this.foroCurso!=undefined){
            this.NombreCurso=this.foroCurso[0].pGeneral
            this.foroCurso.forEach((e:any) => {
            if(e.estadoAtendido==0){
              e.estadoForo='Pendiente'
            }
            else{
              e.estadoForo='Resuelto'
            }
            e.fechaPublicacion=datePipe.transform(e.fechaPublicacion, 'dd-MM-yyyy hh:mm a.');
            e.fechaRespuesta=datePipe.transform(e.fechaRespuesta, 'dd-MM-yyyy hh:mm a.');
            e.Acciones=e.estadoAtendido==1?'Ver':'Responder'
          });
          console.log(this.foroCurso)
          }
        },
      });
  }
  AbrirForo(index:number){
    const dialogRef = this.dialog.open(DocenciaResponderForoCursoModalComponent, {
      width: '900px',
      data: {
        idPGeneral:this.foroCurso[index].idPGeneral,
        idTemaForo:this.foroCurso[index].idTemaForo,
        pgeneral:this.foroCurso[index].pgeneral,},
      panelClass: 'custom-dialog-container',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      if(result==true){
        this.foroCurso=undefined;
        this.TerminaCarga=false;
        this.ObtenerForosPorCursoDocente()

      }
    });
  }
  Regresar(){
    this.RegresarAhora=true;
  }
}
