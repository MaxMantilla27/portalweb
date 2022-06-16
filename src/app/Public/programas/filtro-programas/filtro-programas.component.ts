import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import {
  FiltrosProgramasDTO,
  ModalidadDTO,
  TipoProgramaDTO,
} from 'src/app/Core/Models/FiltrosProgramasDTO';

@Component({
  selector: 'app-filtro-programas',
  templateUrl: './filtro-programas.component.html',
  styleUrls: ['./filtro-programas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FiltroProgramasComponent implements OnInit {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<FiltroProgramasComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  public TagBusqueda: Array<Basic> = [];
  public TagAreas: Array<Basic> = [];
  public TagSubAreas: Array<Basic> = [];
  public TagModalidad: Array<Basic> = [];
  public TagTipoPrograma: Array<Basic> = [];
  public filtros: FiltrosProgramasDTO = {
    areaCapacitacion: [],
    modalidad: [],
    tipoPrograma: [],
  };
  public Modalidad: Array<ModalidadDTO> = [];
  public TipoPrograma: Array<TipoProgramaDTO> = [];
  public buscar = '';
  public textoResult = '';
  public expancions = [false, false, false, false];
  ngOnInit(): void {
    this.TagBusqueda = this.data.TagBusqueda;
    this.TagAreas = this.data.TagAreas;
    this.TagSubAreas = this.data.TagSubAreas;
    this.TagModalidad = this.data.TagModalidad;
    this.TagTipoPrograma = this.data.TagTipoPrograma;
    this.filtros = this.data.filtros;
    this.Modalidad = this.data.Modalidad;
    this.TipoPrograma = this.data.TipoPrograma;
    this.buscar = this.data.buscar;
    this.textoResult = this.data.textoResult;
  }

  RemoveAll() {
    this.filtros.areaCapacitacion.forEach((x) => {
      if (x.select != undefined && x.select == true) {
        x.select = false;
        x.subAreaCapacitacion.forEach((s) => {
          if (s.select != undefined && s.select == true) {
            s.select = false;
          }
        });
      }
    });
    this.Modalidad.forEach((x) => {
      if (x.select != undefined && x.select == true) {
        x.select = false;
      }
    });
    this.TipoPrograma.forEach((x) => {
      if (x.select != undefined && x.select == true) {
        x.select = false;
      }
    });
    this.buscar = '';
    this._bottomSheetRef.dismiss({filtros:this.filtros,Modalidad:this.Modalidad,TipoPrograma:this.TipoPrograma,buscar:this.buscar});
    //this.GetProgramas();
  }
  RemoveArea(i: number) {
    this.filtros.areaCapacitacion.forEach((x) => {
      if (x.id == i) {
        x.select = false;
        x.subAreaCapacitacion.forEach((s) => {
          s.select = false;
        });
      }
    });
    this.SetTags()
  }
  RemoveSubArea(i: number) {
    this.filtros.areaCapacitacion.forEach((x) => {
      if (x.select != undefined && x.select == true) {
        x.subAreaCapacitacion.forEach((s) => {
          if (s.id == i) {
            s.select = false;
          }
        });
      }
    });
    this.SetTags()
  }

  RemoveModalidad(i: number) {
    this.Modalidad.forEach((x) => {
      if (x.id == i) {
        x.select = false;
      }
    });
    this.SetTags()
  }

  RemoveTipoPrograma(i: number) {
    this.TipoPrograma.forEach((x) => {
      if (x.id == i) {
        x.select = false;
      }
    });
    this.SetTags()
  }

  openExpand(i: number) {
    console.log(i);

    if (this.expancions[i] == false) {
      this.expancions = [false, false, false, false];
      this.expancions[i] = true;
    } else {
      this.expancions[i] = false;
    }
  }
  SelectMod(index: number) {
    if (this.Modalidad[index].select == true) {
      this.Modalidad[index].select = false;
    } else {
      this.Modalidad[index].select = true;
    }
    this.SetTags()
  }
  SelectTipoP(index: number) {
    if (this.TipoPrograma[index].select == true) {
      this.TipoPrograma[index].select = false;
    } else {
      this.TipoPrograma[index].select = true;
    }
    this.SetTags()
  }
  SelectAreas(index: number) {
    console.log(index)
    console.log(this.filtros)
    if (this.filtros.areaCapacitacion[index].select == true) {
      this.filtros.areaCapacitacion[index].select = false;
      this.filtros.areaCapacitacion[index].subAreaCapacitacion.forEach((x) => {
        x.select = false;
      });
    } else {
      this.filtros.areaCapacitacion[index].select = true;
    }
    this.SetTags()
  }
  SelectSubAreas(index: number, indexSub: number) {
    if (
      this.filtros.areaCapacitacion[index].subAreaCapacitacion[indexSub]
        .select == true
    ) {
      this.filtros.areaCapacitacion[index].subAreaCapacitacion[
        indexSub
      ].select = false;
    } else {
      this.filtros.areaCapacitacion[index].subAreaCapacitacion[
        indexSub
      ].select = true;
    }
    this.SetTags()
  }
  SetTags(){
    this.TagAreas=[]
    this.TagSubAreas=[]
    this.TagTipoPrograma=[]
    this.TagModalidad=[]

    console.log(this.filtros.areaCapacitacion)
    this.filtros.areaCapacitacion.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.TagAreas.push({value:x.id,Nombre:x.nombre});
        x.subAreaCapacitacion.forEach(s=>{
          if(s.select!=undefined && s.select==true){
            this.TagSubAreas.push({value:s.id,Nombre:s.nombre})
          }
        })
      }
    })
    this.TipoPrograma.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.TagTipoPrograma.push({value:x.id,Nombre:x.nombre})
      }
    })
    this.Modalidad.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.TagModalidad.push({value:x.id,Nombre:x.nombre})
      }
    })
  }
  AplicarFiltro(){
    this._bottomSheetRef.dismiss({filtros:this.filtros,Modalidad:this.Modalidad,TipoPrograma:this.TipoPrograma,buscar:this.buscar});
  }
  closeDialog(event: MouseEvent): void {
    event.preventDefault();
    this._bottomSheetRef.dismiss();
    // this.bottomSheet.close(BottomSheetOverviewExampleSheet);
  }
}
