
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Programa';
  private idPegeneralSubject = new BehaviorSubject<number>(0);
  private idCategoriaSubject = new BehaviorSubject<number>(0);
  private nombreProgramaSubject = new BehaviorSubject<string>("");
  idPegeneral$ = this.idPegeneralSubject.asObservable();
  idCategoria$ = this.idCategoriaSubject.asObservable();
  nombreProgramaCurso$ = this.nombreProgramaSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  setIdPegeneral(id: number): void {
    this.idPegeneralSubject.next(id);
  }
  setIdCategoria(id: number, nombre: string): void {
    this.idCategoriaSubject.next(id);
    this.nombreProgramaSubject.next(nombre);
  }
  public EstructuraProgramaPortal(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/EstructuraProgramaPortal?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public VistaPreviaProgramaPadrePortal(PrimerCurso:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/VistaPreviaProgramaPadrePortal?PrimerCurso='+PrimerCurso);
    }else{
      return EMPTY;
    }
  }
  public VistaPreviaProgramaPortal(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/VistaPreviaProgramaPortal?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public IdCategoriaPrograma(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerIdCategoriaPrograma?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
}
