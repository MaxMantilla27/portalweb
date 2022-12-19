import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-home-formacion-continua',
  templateUrl: './home-formacion-continua.component.html',
  styleUrls: ['./home-formacion-continua.component.scss']
})
export class HomeFormacionContinuaComponent implements OnInit,OnDestroy,AfterViewInit {

  private signal$ = new Subject();

  constructor(
    private _HelperService :HelperService,
  ) { }
  public Formacion: Array<BasicUrl> = [];
  public tabindex=0;
  public selectFormacion=0;
  public cargaTabs=false



  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngAfterViewInit(): void {
    this.tabindex=0
  }
  ngOnInit(): void {
    this._HelperService.recibirArrayFormacion.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        if(this.Formacion.length==0){
          this.Formacion=x;
          let i=0
          this.Formacion.forEach(x=>{
            if(i==0){
              x.change=true;
            }else{
              x.change=false;
            }
            i++
          })
          this.tabindex=0;
          this.selectFormacion=this.Formacion[this.tabindex].value;
        }
      }
    });
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    if(this.cargaTabs){
      this._HelperService.enviarMsjAcciones({Tag:'Tab',Nombre:tabChangeEvent.tab.textLabel,Seccion:'Formación continua'})
    }
    this.cargaTabs=true
    this.tabindex=tabChangeEvent.index;
    this.selectFormacion=this.Formacion[this.tabindex].value;
    if(this.Formacion[this.tabindex].change!=true){
      this.Formacion[this.tabindex].change=true
    }
  }

}
