import {ElementRef, Injectable, ViewChild, ViewContainerRef,
} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {

  constructor(
  ) {}

  mensajeEliminar() {
    return Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionCuestionario() {
    return Swal.fire({
      title: 'Se restaurarán los cuestionarios de todos los alumnos. ¿Desea continuar?',
      text: '¡Se borrarán todos los intentos realizados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionTarea() {
    return Swal.fire({
      title: 'Se publicará la tarea para ser visible por los alumnos. ¿Desea continuar?',
      // text: '¡Se borrarán todas las tareas realizadas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionEdicionCuestionario() {
    return Swal.fire({
      title: 'El cuestionario se actualizará manteniendo su estado de publicación. ¿Desea continuar?',
      // text: '¡Se borrarán todos los intentos realizados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionRegistroCuestionario() {
    return Swal.fire({
      title: 'El cuestionario no será visible hasta su publicación. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionRegistroTarea() {
    return Swal.fire({
      title: 'La tarea no será visible hasta su publicación. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionEdicionTarea() {
    return Swal.fire({
      title: 'Se guardarán todos los cambios. ¿Desea continuar?',
      // text: '¡Se borrarán todas las tareas realizadas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionActividad() {
    return Swal.fire({
      title: 'Se publicará la actividad para ser visible por los alumnos. ¿Desea continuar?',
      // text: '¡Se borrarán todas las tareas realizadas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionRegistroActividad() {
    return Swal.fire({
      title: 'La actividad no será visible hasta su publicación. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeConfirmacionEdicionActividad() {
    return Swal.fire({
      title: 'Se guardarán todos los cambios. ¿Desea continuar?',
      // text: '¡Se borrarán todas las tareas realizadas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
}
