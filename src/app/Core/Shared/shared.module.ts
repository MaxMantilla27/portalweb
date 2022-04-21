import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './Containers/header/header.component';
import { ButtonComponent } from './Containers/button/button.component';
import { MatMenuModule } from '@angular/material/menu';
import { SelectComponent } from './Containers/select/select.component';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { FooterComponent } from './Containers/footer/footer.component';

import {SessionStorageService} from '../Shared/Services/session-storage.service'
import { PaisService } from './Services/Pais/pais.service';
import { CarreraProfecionalService } from './Services/Carrera/carrera-profecional.service';
import { HeaderPermissionsService } from './Services/header-permissions.service';
import { AreacapasitacionService } from './Services/AreaCapasitacion/areacapasitacion.service';

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  declarations: [HeaderComponent, ButtonComponent, SelectComponent, FooterComponent],
  exports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    HeaderComponent,
    FooterComponent,

    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  providers: [
    SessionStorageService,
    PaisService,
    CarreraProfecionalService,
    HeaderPermissionsService,
    AreacapasitacionService
  ],
})
export class SharedModule {
  constructor() {}
}
