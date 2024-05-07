import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ImagenModalComponent } from 'src/app/Core/Shared/Containers/Dialog/imagen-modal/imagen-modal.component';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { ProcesoMatriculaModalComponent } from './proceso-matricula-modal/proceso-matricula-modal.component';

@Component({
  selector: 'app-transparencia',
  templateUrl: './transparencia.component.html',
  styleUrls: ['./transparencia.component.scss']
})
export class TransparenciaComponent implements OnInit {

  constructor(
    private _SeoService:SeoService,
    private title:Title,
    public dialog: MatDialog,
  ) { }
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Transparencia',
      urlWeb: '/Transparencia'
    }
  ]
  ngOnInit(): void {

    let t:string='BSG Institute - Transparencia'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      title:'BSG Institute - Transparencia',
      slug:'Transparencia',
      description:'Programas, Certificaciones y Cursos en Big Data, Analytics, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 27001, Construcción, Minería.',
      keywords:'BSG Institute,curso de excel avanzado, curso autocad, curso de excel basico, especializacion en gerencia de proyectos, certificacion itil, especializacion en salud ocupacional, curso ms project,curso revit',
    });
  }
  ModalProcesoMatricula(){
    this.dialog.open(ProcesoMatriculaModalComponent, {
      panelClass: 'dialog-imagen-proceso-matricula',
      disableClose:true
    });
  }

}
