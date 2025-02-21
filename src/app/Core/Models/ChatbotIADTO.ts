export interface MensajeChatbotIADTO {
    mensaje: string;
    esUsuario: boolean;
    fechaEnvio: string
};

export interface RegistroChatbotIADTO{
    IdChatbotPortalHiloChat?: number;
    Mensaje?: string;
    Cerrado: boolean;
    Derivado: boolean;
    TiempoActual?: Date;
    IdMatriculaCabecera?: number;
    IdPGeneral?: number;
    ChatDerivado?: number;
    IdContactoPortalSegmento?: string;
    CodigoAreaDerivacion?: number;
    IdAlumno?:number;
}
