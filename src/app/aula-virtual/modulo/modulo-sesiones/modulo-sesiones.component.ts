import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { AlumnosTest } from 'src/app/Core/Shared/AlumnosTest';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
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
    private r:ActivatedRoute,
    private _AlumnosTest:AlumnosTest,
    private _HelperService:HelperService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.estructuraCapitulo)
    if (this.estructuraCapitulo != undefined && this.estructuraCapitulo.registroEstructuraCursoCapitulo!=null) {
      var cap = 0,ses = 0,subs = 0,enc=0,tar=0,tarC=0;
      console.log(this.estructuraCapitulo);
      var alumnoTest=this._AlumnosTest.Allpermisions(this.estructuraCapitulo.idAlumno);
      this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach((c: any) => {
          c.cap=cap
          c.registroEstructuraCursoSesion.forEach((s: any) => {
            s.ses=ses
            if(this.estructuraCapitulo.contineSubSesion==true){
              s.subV = 0;
              s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
                ss.subs=subs
                ss.habilitado=false;

                if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                  ss.habilitado=true;
                }
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
                        )>=98
                      ){
                        if(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.length>0){
                          ss.habilitado=true
                          this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.forEach((e:any) => {
                            if(e.nombreEncuesta!='Encuesta Inicial'){
                              if(e.encuestaEnviada!=true){
                                ss.habilitado=false;
                                if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                  ss.habilitado=true;
                                }
                              }
                            }
                          });
                        }else{
                          ss.habilitado=true
                        }
                        console.log(cap)
                        console.log('enc-'+ss.habilitado)
                        console.log(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta)
                        if(ss.habilitado==true){
                          if(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.length>0){
                            s.habilitado=true
                            this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.forEach((t:any) => {
                              if(t.tareasEnviadas==0){
                                ss.habilitado=false;
                                if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                  ss.habilitado=true;
                                }
                              }
                            });
                          }else{
                            ss.habilitado=true
                          }
                        }
                        if(s.habilitado==true){
                          if(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.length>0){
                            s.habilitado=true
                            this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.forEach((tc:any) => {
                              if(!tc.calificado){
                                ss.habilitado=false;
                                if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                  ss.habilitado=true;
                                }
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
                    if(Math.ceil(c.registroEstructuraCursoSesion[ses-1].registroEstructuraCursoSubSesion[lastsub].porcentajeVideoVisualizado)>=98){
                      ss.habilitado=true;
                    }
                  }
                }else{
                  if(Math.ceil(s.registroEstructuraCursoSubSesion[subs-1].porcentajeVideoVisualizado)>=98){
                    ss.habilitado=true;
                  }
                }
                subs++;
              });
              subs=0;
            }else{
              s.habilitado=false;
              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                s.habilitado=true;
              }
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
                  console.log(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoSesion[latcap])
                  console.log(c)
                  if(
                    Math.ceil(
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoSesion[latcap].porcentajeVideoVisualizado
                      )>=98
                    ){
                    if(
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.length>0 ||
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.length>0 ||
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.length>0
                    ){
                      if(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.length>0){
                        s.habilitado=true
                        this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.forEach((e:any) => {
                          if(e.nombreEncuesta!='Encuesta Inicial' ){
                            if(e.encuestaEnviada!=true){
                              s.habilitado=false;
                              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                s.habilitado=true;
                              }
                            }
                          }
                        });
                      }else{
                        s.habilitado=true
                      }
                      if(s.habilitado==true){
                        if(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.length>0){
                          s.habilitado=true
                          this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.forEach((t:any) => {
                            if(t.tareasEnviadas==0){
                              s.habilitado=false;
                              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                s.habilitado=true;
                              }
                            }
                          });
                        }else{
                          s.habilitado=true
                        }
                      }
                      if(s.habilitado==true){
                        if(this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.length>0){
                          s.habilitado=true
                          this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.forEach((tc:any) => {
                            if(!tc.calificado){
                              s.habilitado=false;
                              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                s.habilitado=true;
                              }
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
                if(Math.ceil(c.registroEstructuraCursoSesion[ses-1].porcentajeVideoVisualizado)>=98){
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
            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
              e.habilitado=true;
            }
            if(e.nombreEncuesta!='Encuesta Inicial'){
              if(enc>0){
                if(Math.ceil(c.registroEstructuraCursoEncuesta[enc-1].porcentajeVideoVisualizado)>=98){
                  e.habilitado=true;
                }
              }else{
                if(this.estructuraCapitulo.contineSubSesion==true){
                  var lastSubses=c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1
                  if(Math.ceil(c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion[lastSubses].porcentajeVideoVisualizado)>=98){
                    e.habilitado=true;
                  }
                }else{
                  if(Math.ceil(c.registroEstructuraCursoSesion[lastses].porcentajeVideoVisualizado)>=98){
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
            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
              t.habilitado=true;
            }
            if(tar>0){
              if(c.registroEstructuraCursoTarea[tar-1].tareasEnviadas==true){
                t.habilitado=true;
              }
            }else{
              if(this.estructuraCapitulo.contineSubSesion==true){
                var lastSubses=c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion[lastSubses].porcentajeVideoVisualizado)>=98){
                  t.habilitado=true;
                }
              }else{
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].porcentajeVideoVisualizado)>=98){
                  t.habilitado=true;
                }
              }
            }
            tar++
          });
          tar=0;
          c.registroCursoTareaCalificar.forEach((t:any) => {
            t.habilitado=false;
            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
              t.habilitado=true;
            }
            if(tarC>0){
              if(Math.ceil(c.registroCursoTareaCalificar[tarC-1].porcentajeVideoVisualizado)>=98){
                t.habilitado=true;
              }
            }else{
              if(this.estructuraCapitulo.contineSubSesion==true){
                var lastSubses=c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion.length-1
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].registroEstructuraCursoSubSesion[lastSubses].porcentajeVideoVisualizado)>=98){
                  t.habilitado=true;
                }
              }else{
                if(Math.ceil(c.registroEstructuraCursoSesion[lastses].porcentajeVideoVisualizado)>=98){
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
  @Input() IdMatriculaCabecera=0;
  ngOnInit(): void {
  }
  IrVideo(url:string,habilitado:boolean){
    console.log(url)
    if(habilitado){
      this._Router.navigate(['AulaVirtual/MisCursos/'+this.IdMatriculaCabecera+'/'+this.estructuraCapitulo.idPEspecificoHijo+'/'+url])
      //this._Router.navigate([url], {relativeTo: this.r})
    }else{
      this._SnackBarServiceService.openSnackBar("Debes completar las actividades anteriores primero",'x',10,"snackbarCrucigramaerror");
    }
  }
  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Programa:this.Capitulo})
  }
}
