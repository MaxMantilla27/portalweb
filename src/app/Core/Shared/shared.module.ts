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
import { CardArticulosComponent } from './Containers/card/card-articulos/card-articulos.component';
import { CardMatriculasComponent } from './Containers/card/card-matriculas/card-matriculas.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgramaContenidoService } from './Services/ProgramaContenido/programa-contenido.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ForoCursoService } from './Services/ForoCurso/foro-curso.service';
import { VideoBrightcoveComponent } from './Containers/Video/video-brightcove/video-brightcove.component';
import { CrucigramaComponent } from './Containers/crucigrama/crucigrama.component';
import { CrucigramaService } from './Services/Crucigrama/crucigrama.service';
import { SnackBarServiceService } from './Services/SnackBarService/snack-bar-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SafePipe } from './Pipes/safe.pipe';
import { CloudflareStreamModule } from '@cloudflare/stream-angular';
import { MaterialAdicionalService } from './Services/MaterialAdicional/material-adicional.service';
import { CertificadoService } from './Services/Certificado/certificado.service';
import { CertificadoIntegraService } from './Services/CertificadoIntegra/certificado-integra.service';
import { ProveedorGuard } from 'src/app/aula-virtual/Guard/proveedor.guard';
import { ProveedorService } from './Services/Proveedor/proveedor.service';
import { ProgramaEspecificoIntegraService } from './Services/ProgramaEspecificoIntegra/programa-especifico-integra.service';
import { TableComponent } from './Containers/table/table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatmenuComponent } from './Containers/matmenu/matmenu.component';
import { LibroReclamacionService } from './Services/LibroReclamacion/libro-reclamacion.service';
import { VideoBrightcovePruebaComponent } from './Containers/video-brightcove-prueba/video-brightcove-prueba/video-brightcove-prueba.component';
import { CapitalicePipe } from './Pipes/capitalice.pipe';
import { MedioPagoActivoPasarelaService } from './Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { ImagenTarjetas } from './ImagenTarjetas';
import { FormaPagoService } from './Services/FormaPago/forma-pago.service';
import { ChargeComponent } from './Containers/Dialog/charge/charge.component';
import { InputCardDirective } from './Directives/input-card.directive';
import { InputCardFechaDirective } from './Directives/input-card-fecha.directive';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { CardMatriculasPruebaComponent } from './Containers/card/card-matriculas-prueba/card-matriculas-prueba/card-matriculas-prueba.component';
import { GlobalService } from './Services/Global/global.service';
import { SoporteTecnicoComponent } from './Containers/soporte-tecnico/soporte-tecnico.component';
import { ChatDetalleIntegraService } from './Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { ChatComponent } from './Containers/chat/chat.component';
import { FormChatComponent } from './Containers/form-chat/form-chat.component';
import { ReporteParticipacionExpositorService } from './Services/ReporteParticipacionExpositor/reporte-participacion-expositor.service';
import { OperacionesNotaService } from './Services/OperacionesNota/operaciones-nota.service';
import { AprovacionComponent } from './Containers/Dialog/aprovacion/aprovacion.component';
import { OperacionesAsistenciaService } from './Services/OperacionesAsistencia/operaciones-asistencia.service';
import { OperacionesEvaluacionService } from './Services/OperacionesEvaluacion/operaciones-evaluacion.service';
import { OperacionesPEspecificoService } from './Services/OperacionesPEspecifico/operaciones-pespecifico.service';
import { TextHtmlEditorComponent } from './Containers/text-html-editor/text-html-editor.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { AutoEvaluacionService } from './Services/AutoEvaluacion/auto-evaluacion.service';
import { TrabajoDeParesIntegraService } from './Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';
import { IntegraEsquemaEvaluacionService } from './Services/IntegraEsquemaEvaluacion/integra-esquema-evaluacion.service';
import { ChatPortalComponent } from './Containers/chat-portal/chat-portal.component';
import { SeoService } from './Services/seo.service';
import { VideoAyudaComponent } from './Containers/video-ayuda/video-ayuda.component';
import { AlumnosTest } from './AlumnosTest';
import {TextFieldModule} from '@angular/cdk/text-field';
import { CargandoComponent } from './Containers/cargando/cargando.component';
import { ChatZComponent } from './Containers/chat-z/chat-z.component';
import { LazyLoadImagesDirective } from './Directives/lazy-load-images.directive';
import { CardBlancComponent } from './Containers/card/card-blanc/card-blanc.component';
import { ChargeTextComponent } from './Containers/Dialog/charge-text/charge-text.component';
import { LoadVerticalComponent } from './Containers/load-vertical/load-vertical.component';
import { EliminarComponent } from './Containers/Dialog/eliminar/eliminar.component';
import { CertificadoIntegraPortalService } from './Services/CertificadoIntegraPortal/certificado-integra-portal.service';
import { DefaultButtonFlechaComponent } from './Containers/buttons/default-button-flecha/default-button-flecha.component';
import { FormularioAzulComponent } from './Containers/formulario-azul/formulario-azul.component';
import { FormularioPopUpComponent } from './Containers/formulario-pop-up/formulario-pop-up.component';
import { ScrollTopComponent } from './Containers/scroll-top/scroll-top.component';
import { FormularioRojoComponent } from './Containers/formulario-rojo/formulario-rojo.component';
import { FacebookLoginComponent } from './Containers/facebook-login/facebook-login.component';
import { SocialAuthService } from 'angularx-social-login';
import { TableV2Component } from './Containers/table-v2/table-v2.component';
import { TablePortalComponent } from './Containers/table-portal/table-portal.component';
import { MatChipsModule } from '@angular/material/chips';
import { FacebookPixelService } from './Services/FacebookPixel/facebook-pixel.service';
import { MatRadioModule } from '@angular/material/radio';
import { ChatbotComponent } from './Containers/chatbot/chatbot.component';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { HeaderChatbotComponent } from './Containers/header-chatbot/header-chatbot.component';
import { PespecificoSesionTemaService } from './Services/PespecificoSesionTema/pespecifico-sesion-tema.service';
import { PEspecificoEsquemaService } from './Services/PEspecificoEsquema/pespecifico-esquema.service';
import { PEspecificoSesionRecursoConectividadService } from './Services/PEspecificoSesionRecursoConectividad/pespecifico-sesion-recurso-conectividad.service';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { ChangeWordComponent } from './Containers/Dialog/change-word/change-word.component';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TableCalificarEvaluacionesComponent } from './Containers/table-calificar-evaluaciones/table-calificar-evaluaciones.component';
import { TableDocenteResponderForosComponent } from './Containers/table-docente-responder-foros/table-docente-responder-foros.component';
import { ImagenModalComponent } from './Containers/Dialog/imagen-modal/imagen-modal.component';
import { ChargePuntosComponent } from './Containers/Dialog/charge-puntos/charge-puntos.component';
import { RemovePuntoComaPipe } from './Pipes/remove-punto-coma.pipe';
import { ChargeSpinnerComponent } from './Containers/Dialog/charge-spinner/charge-spinner.component';
import { RemovePortalCriterioPipe } from './Pipes/remove-portal-criterio.pipe';
import { EnvioEncuestaDocenteOnlineService } from './Services/EnvioEncuestaDocenteOnline/envio-encuesta-docente-online.service';
import { FormatoMilesDecimalesPipe } from './Pipes/formato-miles-decimales.pipe';

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
    MatSliderModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    CloudflareStreamModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatBottomSheetModule,
    CKEditorModule,
    TextFieldModule,
    MatChipsModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatRadioModule,
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
    CardWhitePapersComponent,
    CardArticulosComponent,
    CardMatriculasComponent,
    VideoBrightcoveComponent,
    CrucigramaComponent,
    SafePipe,
    TableComponent,
    MatmenuComponent,
    VideoBrightcovePruebaComponent,
    CapitalicePipe,
    ChargeComponent,
    CardMatriculasPruebaComponent,
    SoporteTecnicoComponent,
    ChatComponent,
    FormChatComponent,
    AprovacionComponent,
    TextHtmlEditorComponent,
    ChatPortalComponent,
    VideoAyudaComponent,
    CargandoComponent,


    InputCardDirective,
    InputCardFechaDirective,
    LazyLoadImagesDirective,
    CardBlancComponent,
    ChargeTextComponent,
    LoadVerticalComponent,
    EliminarComponent,
    DefaultButtonFlechaComponent,
    FormularioAzulComponent,
    FormularioPopUpComponent,
    ScrollTopComponent,
    FormularioRojoComponent,
    FacebookLoginComponent,
    ChatbotComponent,
    HeaderChatbotComponent,

    TableV2Component,
    TablePortalComponent,
    ChangeWordComponent,
    TableCalificarEvaluacionesComponent,
    TableDocenteResponderForosComponent,
    ImagenModalComponent,
    ChargePuntosComponent,
    RemovePuntoComaPipe,
    ChargeSpinnerComponent,
    RemovePortalCriterioPipe,
    FormatoMilesDecimalesPipe
    //ChatZComponent,
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
    CardArticulosComponent,
    CardMatriculasComponent,
    VideoBrightcoveComponent,
    CrucigramaComponent,
    TableComponent,
    TableV2Component,
    TablePortalComponent,
    MatmenuComponent,
    ChargeComponent,
    VideoBrightcovePruebaComponent,
    CardMatriculasPruebaComponent,
    SoporteTecnicoComponent,
    ChatComponent,
    FormChatComponent,
    AprovacionComponent,
    TextHtmlEditorComponent,
    CargandoComponent,
    ChargeTextComponent,
    ChangeWordComponent,
    //ChatZComponent,

    InputCardDirective,
    InputCardFechaDirective,
    LazyLoadImagesDirective,

    CapitalicePipe,

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
    MatBottomSheetModule,
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
    IconInformationCardComponent,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    SafePipe,
    CloudflareStreamModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    CKEditorModule,
    TextFieldModule,
    ChatPortalComponent,
    VideoAyudaComponent,
    LoadVerticalComponent,
    EliminarComponent,
    DefaultButtonFlechaComponent,
    FormularioAzulComponent,
    FormularioPopUpComponent,
    ScrollTopComponent,
    FacebookLoginComponent,
    MatChipsModule,
    MatSlideToggleModule,
    MatRadioModule,
    HeaderChatbotComponent,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TableCalificarEvaluacionesComponent,
    TableDocenteResponderForosComponent,
    MatSlideToggleModule,
    ImagenModalComponent,
    RemovePuntoComaPipe,
    RemovePortalCriterioPipe,
    FormatoMilesDecimalesPipe
  ],
  providers: [
    SessionStorageService,
    PaisService,
    CarreraProfesionalService,
    HeaderPermissionsService,
    AreacapasitacionService,
    PartnerService,
    AspNetUserService,
    AlumnoService,
    AvatarService,
    ArticuloService,
    RegionService,
    DatosPortalService,
    PoliticaPrivacidadService,
    TerminosCondicionesService,
    ProgramaContenidoService,
    ForoCursoService,
    CrucigramaService,
    SnackBarServiceService,
    MaterialAdicionalService,
    CertificadoService,
    CertificadoIntegraService,
    ProveedorService,
    ProgramaEspecificoIntegraService,
    LibroReclamacionService,
    MedioPagoActivoPasarelaService,
    ImagenTarjetas,
    AlumnosTest,
    FormaPagoService,
    GlobalService,
    ChatDetalleIntegraService,
    ReporteParticipacionExpositorService,
    OperacionesNotaService,
    OperacionesAsistenciaService,
    OperacionesEvaluacionService,
    OperacionesPEspecificoService,
    AutoEvaluacionService,
    TrabajoDeParesIntegraService,
    IntegraEsquemaEvaluacionService,
    SeoService,
    CertificadoIntegraPortalService,
    SocialAuthService,
    FacebookPixelService,
    SocialAuthService,
    PespecificoSesionTemaService,
    PEspecificoEsquemaService,
    PEspecificoSesionRecursoConectividadService,
    RemovePortalCriterioPipe,
    EnvioEncuestaDocenteOnlineService,
    FormatoMilesDecimalesPipe
  ],
})
export class SharedModule {
  constructor() {}
}
