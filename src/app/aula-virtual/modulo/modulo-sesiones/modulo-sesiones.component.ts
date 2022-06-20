import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-modulo-sesiones',
  templateUrl: './modulo-sesiones.component.html',
  styleUrls: ['./modulo-sesiones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModuloSesionesComponent implements OnInit, OnChanges {
  constructor(
    private _Router:Router,
    private _SnackBarServiceService:SnackBarServiceService,
    private r:ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.estructuraCapitulo)
    if (this.estructuraCapitulo != undefined) {
      var cap = 0,ses = 0,subs = 0,enc=0,tar=0,tarC=0;

      this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach((c: any) => {
          c.registroEstructuraCursoSesion.forEach((s: any) => {

            if(this.estructuraCapitulo.contineSubSesion==true){
              s.subV = 0;
              s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
                ss.habilitado=false;
                if (Math.ceil(ss.porcentajeVideoVisualizado) >= 100) {
                  s.subV++;
                }

                if(subs==0){
                  if(ses==0){
                    if(cap==0){
                      c.registroEstructuraCursoEncuesta.forEach((e:any) => {
                        if(e.nombreEncuesta=='Encuesta Inicial'){
                          if(e.encuestaEnviada==true){
                            ss.habilitado=true;
                          }
                        }
                      });
                      if(c.registroEstructuraCursoEncuesta.length==0){
                        ss.habilitado=true;
                      }
                    }else{
                      var lastses=this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoSesion.length-1
                      var lastsub=this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1

                      if(
                        Math.ceil(
                          this.estructuraCapitulo.
                          registroEstructuraCursoCapitulo[cap-1].
                          registroEstructuraCursoSesion[lastses].
                          registroEstructuraCursoSubSesion[lastsub].
                          porcentajeVideoVisualizado
                        )>=100
                      ){
                        if(c.registroEstructuraCursoEncuesta.length>0){
                          c.registroEstructuraCursoEncuesta.forEach((e:any) => {
                            if(e.nombreEncuesta!='Encuesta Inicial'){
                              if(e.encuestaEnviada!=true){
                                ss.habilitado=false;
                              }
                            }
                          });
                        }else{
                          ss.habilitado=true
                        }
                        if(ss.habilitado==true){
                          if(c.registroEstructuraCursoTarea.length>0){
                            c.registroEstructuraCursoTarea.forEach((t:any) => {
                              if(t.tareasEnviadas==0){
                                ss.habilitado=false;
                              }
                            });
                          }else{
                            ss.habilitado=true
                          }
                        }
                        if(s.habilitado==true){
                          if(c.registroCursoTareaCalificar.length>0){
                            c.registroCursoTareaCalificar.forEach((tc:any) => {
                              if(!tc.calificado){
                                ss.habilitado=false;
                              }
                            });
                          }else{
                            ss.habilitado=true
                          }
                        }
                      }
                    }
                  }else{
                    var lastsub=c.registroEstructuraCursoSesion[ses-1].registroEstructuraCursoSubSesion.length-1
                    if(Math.ceil(c.registroEstructuraCursoSesion[ses-1].registroEstructuraCursoSubSesion[lastsub].porcentajeVideoVisualizado)>=100){
                      ss.habilitado=true;
                    }
                  }
                }else{
                  if(Math.ceil(s.registroEstructuraCursoSubSesion[subs-1].porcentajeVideoVisualizado)>=100){
                    ss.habilitado=true;
                  }
                }
                subs++;
              });
              subs=0;
            }else{
              s.habilitado=false;
              if(ses==0){
                if(cap==0){
                  c.registroEstructuraCursoEncuesta.forEach((e:any) => {
                    if(e.nombreEncuesta=='Encuesta Inicial'){
                      if(e.encuestaEnviada==true){
                        s.habilitado=true;
                      }
                    }
                  });

                  if(c.registroEstructuraCursoEncuesta.length==0){
                    s.habilitado=true;
                  }
                }else{
                  var latcap=this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoSesion.length-1
                  if(
                    Math.ceil(
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoSesion[latcap].porcentajeVideoVisualizado
                      )>=100
                    ){
                    if(
                      c.registroCursoTareaCalificar.length>0 ||
                      c.registroEstructuraCursoEncuesta.length>0 ||
                      c.registroEstructuraCursoTarea.length>0
                    ){
                      var habilitar=false
                      if(c.registroEstructuraCursoEncuesta.length>0){
                        c.registroEstructuraCursoEncuesta.forEach((e:any) => {
                          if(e.nombreEncuesta!='Encuesta Inicial'){
                            if(e.encuestaEnviada!=true){
                              s.habilitado=false;
                            }
                          }
                        });
                      }else{
                        s.habilitado=true
                      }
                      if(s.habilitado==true){
                        if(c.registroEstructuraCursoTarea.length>0){
                          c.registroEstructuraCursoTarea.forEach((t:any) => {
                            if(t.tareasEnviadas==0){
                              s.habilitado=false;
                            }
                          });
                        }else{
                          s.habilitado=true
                        }
                      }
                      if(s.habilitado==true){
                        if(c.registroCursoTareaCalificar.length>0){
                          c.registroCursoTareaCalificar.forEach((tc:any) => {
                            if(!tc.calificado){
                              s.habilitado=false;
                            }
                          });
                        }else{
                          s.habilitado=true
                        }
                      }
                    }else{
                      s.habilitado=true;
                    }
                  }

                }
              }else{
                if(Math.ceil(c.registroEstructuraCursoSesion[ses-1].porcentajeVideoVisualizado)>=100){
                  s.habilitado=true;
                }
              }
            }
            ses++;
          });
          ses=0;
          var lastses=c.registroEstructuraCursoSesion.length-1
          c.registroEstructuraCursoEncuesta.forEach((e:any) => {
            e.habilitado=false;
            if(e.nombreEncuesta!='Encuesta Inicial'){
              if(enc>0){
                if(Math.ceil(c.registroEstructuraCursoEncuesta[enc-1].porcentajeVideoVisualizado)>=100){
                  e.habilitado=true;
                }
              }else{
                if(this.estructuraCapitulo.contineSubSesion==true){
                  var lastSubses=c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1
                  if(Math.ceil(c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion[lastSubses].porcentajeVideoVisualizado)>=100){
                    e.habilitado=true;
                  }
                }else{
                  if(Math.ceil(c.registroEstructuraCursoSesion[lastses].porcentajeVideoVisualizado)>=100){
                    e.habilitado=true;
                  }
                }

              }

              enc++
            }
          });
          enc=0;
          c.registroEstructuraCursoTarea.forEach((t:any) => {
            t.habilitado=false;
            if(tar>0){
              if(Math.ceil(c.registroEstructuraCursoTarea[tar-1].porcentajeVideoVisualizado)>=100){
                t.habilitado=true;
              }
            }else{
              if(this.estructuraCapitulo.contineSubSesion==true){
                var lastSubses=c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion[lastSubses].porcentajeVideoVisualizado)>=100){
                  t.habilitado=true;
                }
              }else{
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].porcentajeVideoVisualizado)>=100){
                  t.habilitado=true;
                }
              }
            }
            tar++
          });
          tar=0;
          c.registroCursoTareaCalificar.forEach((t:any) => {
            t.habilitado=false;
            if(tarC>0){
              if(Math.ceil(c.registroCursoTareaCalificar[tarC-1].porcentajeVideoVisualizado)>=100){
                t.habilitado=true;
              }
            }else{
              if(this.estructuraCapitulo.contineSubSesion==true){
                var lastSubses=c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion[lastSubses].porcentajeVideoVisualizado)>=100){
                  t.habilitado=true;
                }
              }else{
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].porcentajeVideoVisualizado)>=100){
                  t.habilitado=true;
                }
              }
            }
            tarC++
          });
          tarC=0;
          cap++;
        }
      );
      console.log(this.estructuraCapitulo);
    }
  }
  @Input() Capitulo = '';
  @Input() estructuraCapitulo: any;
  @Input() idModalidad: number = 2;
  ngOnInit(): void {
  }
  IrVideo(url:string,habilitado:boolean){
    console.log(habilitado)
    if(habilitado){
      this._Router.navigate([url], {relativeTo: this.r})
    }else{
      this._SnackBarServiceService.openSnackBar("Complete el ítem anterior",'x',10,"snackbarCrucigramaerror");
    }
  }
}
