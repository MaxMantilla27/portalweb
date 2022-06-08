import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';
import { BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { ArticuloService } from 'src/app/Core/Shared/Services/Articulo/articulo.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-bscampus',
  templateUrl: './bscampus.component.html',
  styleUrls: ['./bscampus.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BSCampusComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
    private _ArticuloService:ArticuloService,
    private _SessionStorageService:SessionStorageService
    ) { }

  public migaPan: any =  [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'BS Campus',
      urlWeb: '/bs-campus'
    }
  ];

  public Formacion: Array<BasicUrl> = [];
  public IdArea:number=0;
  public charge=false;
  public blog:Array<ArticuloDTO>=[];
  public whitePapers:Array<ArticuloDTO>=[];
  public index=0;
  ngOnInit(): void {

    this._HelperService.recibirArrayFormacion.subscribe({
      next:(x)=>{
        this.Formacion=x;
        this.Formacion.forEach(x=>{
          x.change=false;
        })
      }
    });
    this.ListArticuloHome(1);
    this.ListArticuloHome(3);
    var sesion=this._SessionStorageService.SessionGetValue('campus');
    if(sesion !=undefined){
      this.index=parseInt(sesion);
      this._SessionStorageService.SessionDeleteValue('campus')
    }
  }
  ListArticuloHome(IdTipoArticulo:number){
    this._ArticuloService.ListArticuloHome(IdTipoArticulo).subscribe({
      next:(x)=>{
        if(IdTipoArticulo==1){
          this.blog=x.listaArticuloHomeDTO
        }

        if(IdTipoArticulo==3){
          this.whitePapers=x.listaArticuloHomeDTO
        }
      },
      error:(e)=>{
      }
    });

  }
}
