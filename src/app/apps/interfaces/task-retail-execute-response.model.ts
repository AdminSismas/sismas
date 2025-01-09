export class TaskRetailExecuteResponseModel{

            public taskId?: number;
            public flowName?: string;
            public processName?:string;
            public flowDetail?: string;
            public assignee?: string;
            public assigneeAt?:string;
            public beginAt?: string;
            public finishAt?: string;
            public dueDate?:string;
            public bpmPriority?:string;
            public devolution?: string;
            public daysFinish?: number;
            public daysBegin?: number;
            public daysBeginS?: string;
            schema?: string;
  

    constructor(content?: any, schema?: string) {
        this.taskId = content?.taskId;
        this.flowName = content?.flowName;
        this.processName = content?.processName;
        this.flowDetail = content?.flowDetail;
        this.assignee = content?.assignee;
        this.assigneeAt = content?.assigneeAt;
        this.beginAt = content?.beginAt;
        this.finishAt = content?.finishAt;
        this.dueDate = content?.dueDate;
        this.bpmPriority = content?.bpmPriority;
        this.devolution = content?.devolution;
        this.daysFinish = content?.daysFinish;
        this.daysBegin = content?.daysBegin;
        this.daysBeginS = content?.daysBeginS;
        this.daysBeginS = content?.daysBeginS;
        this.schema = content?.schema;

        }
}

export class ProcessModel{
    
       public processId?:number;
       public name?:string;
       public description?:string;
       public bpmProcessCategory?:string;
       public key?:string;
       public version?:string;
       public resource?:string;
       public image?:string;
       public validBeginAt?:string;
       public validToAt?:string;
       public dueDays?:number;
       public icon?:string;

       constructor(){
        this.processId = 0;
        this.name = '';
        this.description = '';
        this.bpmProcessCategory = '';
        this.key = '';
        this.version = '';
        this.resource = '';
        this.image = '';
        this.validBeginAt = '';
        this.validToAt = '';
        this.dueDays = 0;
        this.icon = '';
       }
    
}