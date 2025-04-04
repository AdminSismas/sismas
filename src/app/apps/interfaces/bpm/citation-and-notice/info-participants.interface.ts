
export type TypeProcessParticipant = 'ALL' | 'CITADO' | 'AVISO' | 'NOTIFICADO' | 'FINALIZADO';

export interface ProcessParticipantTableMenu {
  type: 'link' | 'subheading';
  id?:
    | 'all'
    | 'citation'
    | 'notification'
    | 'notice'
    ;
  icon?: string;
  label: string;
  classes?: {
    icon?: string;
  };
}
