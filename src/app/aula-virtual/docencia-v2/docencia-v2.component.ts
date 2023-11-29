import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-docencia-v2',
  templateUrl: './docencia-v2.component.html',
  styleUrls: ['./docencia-v2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaV2Component implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  @ViewChild('carreras') carreras!: ElementRef;

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _ProveedorService:ProveedorService,
    private _HelperService: HelperService,
    private _SessionStorageService:SessionStorageService
    ) { }

  public migaPan = [
    {
      titulo: 'Docencia',
      urlWeb: '/AulaVirtual/Docencia',
    }
  ];
  public hide=false
  public tabIndex = 0;
  public DataProveedor:any
  public NombreCurso=''
  public IdPespecifico=0
  public json: ParticipacionExpositorFiltroDTO = {
    IdArea: null,
    IdCentroCosto: null,
    IdCodigoBSCiudad: null,
    IdEstadoPEspecifico: '1,2,3,5',
    IdModalidadCurso: null,
    IdPGeneral: null,
    IdProgramaEspecifico: null,
    IdProveedorOperaciones: '',
    IdSubArea: null,
    IdCentroCostoD: 0,
    SinNotaAprobada: true,
    SinAsistenciaAprobada:null
  };
  public AsincronicoActive = false;
  public CarrerasProfesionalesActive = false;
  ngOnInit(): void {
    this.ObtenerInformacionProveedor();
    var indice=this._SessionStorageService.SessionGetValue('docencia');
    if(indice!=''){
      this.tabIndex=parseInt(indice);
      if(this.tabIndex==2){
        this.changeIndexAsincronico()
        this.tabIndex++
      }
    }
  }

  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.DataProveedor=x

        this.json.IdProveedorOperaciones = this.DataProveedor.id.toString();
        // this.GenerarReporteFiltradoPortal()
      }
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log(tabChangeEvent)
    this._SessionStorageService.SessionSetValue('docencia',this.tabIndex.toString());
    if(this.AsincronicoActive==true){
      if(tabChangeEvent.index>5 || tabChangeEvent.index <2 ){
        this.AsincronicoActive=false
      }else{
        this._SessionStorageService.SessionSetValue('docencia','2');
      }
      if(tabChangeEvent.index==2){
        this.tabIndex=3
      }
    }
    if(this.CarrerasProfesionalesActive==true){
      if(tabChangeEvent.index <4 ){
        this.CarrerasProfesionalesActive=false
      }else{
        this._SessionStorageService.SessionSetValue('docencia','3');
      }
    }


  }
  changeIndexAsincronico() {
    this.AsincronicoActive=true
  }
  changeIndexCarrerasProfesionales() {
    this.tabIndex=3
  }
  AddIndex(item:any){
    console.log(item)
    this.CarrerasProfesionalesActive=true
    this.tabIndex+=item.orden
    this.NombreCurso=item.NombrePadre
    this.IdPespecifico=item.idPEspecificoPadre
  }
}
