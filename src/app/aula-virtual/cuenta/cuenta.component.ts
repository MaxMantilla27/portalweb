import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
})
export class CuentaComponent implements OnInit {
  constructor() {}
  public migaPan = [
    {
      titulo: 'Cuenta',
      urlWeb: '/AulaVirtual/Cuenta',
    },
  ];
  public tabs = [
    { name: 'Mi perfil', activo: true,selector:'<app-cuenta-mis-pagos></app-cuenta-mis-pagos>' },
    { name: 'Mis Pagos', activo: false,selector:'<app-cuenta-mi-perfil></app-cuenta-mi-perfil>' },
  ];
  ngOnInit(): void {}
  changeTab(index: number) {
    this.tabs.forEach((x) => {
      x.activo = false;
    });
    this.tabs[index].activo = true;
  }
}
