
export type TypeProcessParticipant = 'ALL' | 'CITADO' | 'AVISO' | 'NOTIFICADO' | 'FINALIZADO';
export type TypeProcessParticipantId = 'all' | 'citation' | 'notification' | 'notice';

export interface ProcessParticipantTableMenu {
  type: 'link' | 'subheading';
  id?: TypeProcessParticipantId;
  icon?: string;
  label: string;
  classes?: {
    icon?: string;
  };
}
