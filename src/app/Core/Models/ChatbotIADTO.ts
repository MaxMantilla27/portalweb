export interface MensajeChatbotIADTO {
    mensaje: string;
    esUsuario: boolean;
    fechaEnvio: string
};

export interface RegistroChatbotIADTO{
    IdChatbotIAPortalHiloChat?: number;
    Mensaje?: string;
    Cerrado: boolean;
    Derivado: boolean;
    TiempoActual?: Date;
    IdMatriculaCabecera?: number;
    IdPGeneral?: number;
    ChatDerivado?: number;
    IdContactoPortalSegmento?: string;
    IdAreaDerivacion?: number;
    IdAlumno?:number;
}
