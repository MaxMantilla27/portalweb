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
      text: '¡No podrás revertir esto!',
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
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
}
