import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PespecificoSesionTemaService } from 'src/app/Core/Shared/Services/PespecificoSesionTema/pespecifico-sesion-tema.service';
import { PespecificoSesionTemaUpdateDTO, PespecificoSesionTemaSaveDTO, PespecificoSesionTemaUpdateOrdenDTO, PespecificoSesionTemaDeleteDTO } from 'src/app/Core/Models/PespecificoSesionTemaDTO';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ChangeWordComponent } from 'src/app/Core/Shared/Containers/Dialog/change-word/change-word.component';

@Component({
  selector: 'app-pespecifico-sesion-tema',
  templateUrl: './pespecifico-sesion-tema.component.html',
  styleUrls: ['./pespecifico-sesion-tema.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PespecificoSesionTemaComponent
  implements OnInit, OnChanges, OnDestroy
{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _PespecificoSesionTemaService: PespecificoSesionTemaService,
    public dialog: MatDialog,
  ) {}

  public update:PespecificoSesionTemaUpdateDTO={
    Id:0,
    Tema:'',
    Usuario:''
  }
  public save:PespecificoSesionTemaSaveDTO={
    IdPespecificoSesion:0,
    Tema:'',
    Usuario:''
  }
  public updateOrden:PespecificoSesionTemaUpdateOrdenDTO={
    Id:0,
    Orden:0,
  }
  public delete:PespecificoSesionTemaDeleteDTO={
    Id:0,
    Usuario:''
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdSesion != 0) {
      console.log('carga temas....', this.IdSesion);
      this.charge = true;
      this.ObtenerPespecificoSesionTemaPorSesion();
    }
  }
  @Input() IdSesion = 0;
  public charge = false;
  public temas:Array<any>=[]
  public tema=''
  indexselect=-1
  ngOnInit(): void {}
  ObtenerPespecificoSesionTemaPorSesion() {
    this.temas=[]
    this._PespecificoSesionTemaService
      .ObtenerPespecificoSesionTemaPorSesion(this.IdSesion)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          if(x!=null){
            this.temas=x
          }
          this.charge = false;
        },
      });
  }
  OrdenarTemaSesion(id:number,orden:number) {
    this.charge = true;
    this.updateOrden.Id=id;
    this.updateOrden.Orden=orden
    this._PespecificoSesionTemaService.OrdenarTemaSesion(this.updateOrden).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.ObtenerPespecificoSesionTemaPorSesion();
      },
    });
  }
  ActualizarTemaSesion(index:number) {
    this.charge = true;
    this.update.Id=this.temas[index].id;
    this.update.Tema=this.temas[index].tema
    this._PespecificoSesionTemaService.ActualizarTemaSesion(this.update).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.ObtenerPespecificoSesionTemaPorSesion();
      },
    });
  }
  EliminarTemaSesion(index:number) {
    this.charge = true;
    this.delete.Id=this.temas[index].id;
    this._PespecificoSesionTemaService.EliminarTemaSesion(this.delete).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.ObtenerPespecificoSesionTemaPorSesion();
      },
    });
  }
  InsertarTemaSesion() {
    this.charge = true;
    this.save.IdPespecificoSesion=this.IdSesion;
    this.save.Tema=this.tema;
    this._PespecificoSesionTemaService.InsertarTemaSesion(this.save).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.tema=''
        this.ObtenerPespecificoSesionTemaPorSesion();
      },
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.temas, event.previousIndex, event.currentIndex);
    this.OrdenarTemaSesion(this.temas[event.currentIndex].id,event.currentIndex+1)
  }
  OpenEditar(i:number){
    const dialogRef = this.dialog.open(ChangeWordComponent, {
      width: '1000px',
      data: {word:this.temas[i].tema ,label:"Tema",title:"Editar Tema"},
      panelClass: 'dialog-Tarjeta',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.temas[i].tema=result
        this.ActualizarTemaSesion(i)
      }
    });

  }
}
