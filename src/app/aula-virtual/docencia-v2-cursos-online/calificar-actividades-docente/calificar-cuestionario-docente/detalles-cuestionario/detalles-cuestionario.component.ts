import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

@Component({
  selector: 'app-detalles-cuestionario',
  templateUrl: './detalles-cuestionario.component.html',
  styleUrls: ['./detalles-cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallesCuestionarioComponent implements OnInit , OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }


  constructor(
    public dialogRef: MatDialogRef<DetallesCuestionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService
    ) { }

  ngOnInit(): void {
  }

}
