import { PreForm } from '@features/tasks/models/pre-form';

export class ProFlow {

  flowId?: number;
  preform?:PreForm;
  key?: string;
  orderFlow?: number;
  name?: string;
  dueDays?: number;
  bpmLaneNames?: string;
  mode?: number;
  question: string | null = null;
  questionFlow: number | null = null;


  constructor(content?:any) {
    this.flowId = content?.flowId || 0;
    this.preform = content?.preform || null;
    this.key = content?.key || '';
    this.orderFlow = content?.orderFlow || 0;
    this.name = content?.name || '';
    this.dueDays = content?.dueDays || '';
    this.bpmLaneNames = content?.bpmLaneNames || '';
    this.mode = content?.mode || 0;
    this.question = content?.question || null;
    this.questionFlow = content?.questionFlow || null;
  }
}
