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
import { CarreraProfesionalService } from './Services/Carrera/carrera-profesional.service';
import { HeaderPermissionsService } from './Services/header-permissions.service';
import { AreacapasitacionService } from './Services/AreaCapasitacion/areacapasitacion.service';
import { PartnerService } from './Services/Partner/partner.service';
import { CarouselComponent } from './Containers/Carousel/carousel.component';
import { HelperService } from './Services/helper.service';
import { DefaultButtonComponent } from './Containers/buttons/default-button/default-button.component';
import { CustomCardComponent } from './Containers/card/custom-card/custom-card.component';
import { VistaGenericaProgramaComponent } from './Containers/vista-generica-programa/vista-generica-programa.component';
import { MigaPanComponent } from './Containers/miga-pan/miga-pan.component';
import { LinkButtonComponent } from './Containers/buttons/link-button/link-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardProgramasComponent } from './Containers/card/card-programas/card-programas.component';
import {MatSliderModule} from '@angular/material/slider';
import { SafeHtmlPipe } from './Pipes/safe-html.pipe';
import { CardExpositoresComponent } from './Containers/card/card-expositores/card-expositores.component';
import { IconInformationCardComponent } from './Containers/card/icon-information-card/icon-information-card.component';
import { TagButtonComponent } from './Containers/buttons/tag-button/tag-button.component';
import { FormularioComponent } from './Containers/formulario/formulario.component';
import { AspNetUserService } from './Services/AspNetUser/asp-net-user.service';
import { AlumnoService } from './Services/Alumno/alumno.service';
import { AvatarService } from './Services/Avatar/avatar.service';
import { AlumnoMatButtonComponent } from './Containers/buttons/alumno-mat-button/alumno-mat-button.component';
import { ArticuloService } from './Services/Articulo/articulo.service';
import { CardBlogComponent } from './Containers/card/card-blog/card-blog.component';
import { CardWhitePapersComponent } from './Containers/card/card-white-papers/card-white-papers.component';
import { RegionService } from './Services/Region/region.service';
import { DatosPortalService } from './Services/DatosPortal/datos-portal.service';
import { PoliticaPrivacidadService } from './Services/PoliticaPrivacidad/politica-privacidad.service';
import { TerminosCondicionesService } from './Services/TerminosCondiciones/terminos-condiciones.service';

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
    NgbModule,
    MatSliderModule

  ],
  declarations: [
    HeaderComponent,
    ButtonComponent,
    SelectComponent,
    FooterComponent,
    CarouselComponent,
    ButtonComponent,
    CardProgramasComponent,
    SelectComponent,
    DefaultButtonComponent,
    CustomCardComponent,
    VistaGenericaProgramaComponent,
    MigaPanComponent,
    LinkButtonComponent,
    SafeHtmlPipe,
    CardExpositoresComponent,
    IconInformationCardComponent,
    TagButtonComponent,
    FormularioComponent,
    AlumnoMatButtonComponent,
    CardBlogComponent,
    CardWhitePapersComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    HeaderComponent,
    FooterComponent,
    CarouselComponent,
    ButtonComponent,
    CardExpositoresComponent,
    TagButtonComponent,
    FormularioComponent,
    AlumnoMatButtonComponent,
    CardBlogComponent,
    CardWhitePapersComponent,
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
    DefaultButtonComponent,
    LinkButtonComponent,
    CustomCardComponent,
    VistaGenericaProgramaComponent,
    MigaPanComponent,
    NgbModule,
    CardProgramasComponent,
    SelectComponent,
    MatSliderModule,
    SafeHtmlPipe,
    IconInformationCardComponent
  ],
  providers: [
    SessionStorageService,
    PaisService,
    CarreraProfesionalService,
    HeaderPermissionsService,
    AreacapasitacionService,
    PartnerService,
    HelperService,
    AspNetUserService,
    AlumnoService,
    AvatarService,
    ArticuloService,
    RegionService,
    DatosPortalService,
    PoliticaPrivacidadService,
    TerminosCondicionesService
  ],
})
export class SharedModule {
  constructor() {}
}
