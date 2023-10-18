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
      title: 'Se restaurarán las tareas de todos los alumnos. ¿Desea continuar?',
      text: '¡Se borrarán todas las tareas realizadas!',
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
      title: 'El cuestionario no será visible hasta su publicación. ¿Desea continuar?',
      text: '¡Se borrarán todos los intentos realizados!',
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
      title: 'La tarea no será visible hasta su publicación. ¿Desea continuar?',
      text: '¡Se borrarán todas las tareas realizadas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
}
