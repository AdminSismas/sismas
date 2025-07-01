
export type TypeProcessParticipant = 'ALL' | 'CITADO' | 'AVISO' | 'NOTIFICADO' | 'FINALIZADO' | 'PARTICIPANTS';
export type TypeProcessParticipantId = 'all' | 'citation' | 'notification' | 'notice' | 'participants';

export interface ProcessParticipantTableMenu {
  type: 'link' | 'subheading';
  id?: TypeProcessParticipantId;
  icon?: string;
  label: string;
  classes?: {
    icon?: string;
  };
}
