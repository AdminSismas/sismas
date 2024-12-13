export class TableProcedureResponseModel{
        public totalElements?: number;
        public totalPages?: number;
        public size?: number;
        content?: TablaContent[];
        number?: number;
        sort?: TablaSort;
        numberOfElements?: number
        pageable?: TablaPageable;
        first?: true;
        last?: true;
        empty?: true;
      
}

export class TablaContent{
    public executionId?: number;
    public executionCode?: string;
    public process?: ProcessModel;
    public processName?: string;
    public bpmProcessCategory?: string;
    public bpmPriority?: number;
    public beginAt?: string;
    public finishAt?: string;
    public lastUpdateBy?: string;
    public lastUpdateAt?: string;
    public suspensionStartAt?: string;
    public suspendedDays?: number;
    public dueDate?: string;

    constructor(){
    this.executionId = 0;
    this.executionCode = '';
    this.process = new ProcessModel;
    this.processName = '';
    this.bpmProcessCategory = '';
    this.bpmPriority = 0;
    this.beginAt = '';
    this.finishAt = '';
    this.lastUpdateBy = '';
    this.lastUpdateAt = '';
    this.suspensionStartAt = '';
    this.suspendedDays = 0;
    this.dueDate = '';
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

export class TablaSort{

        public empty?:boolean;
        public sorted?:boolean;
        public unsorted?:boolean;
      
}

export class TablaPageable{

          offset?: number;
          sort?:TablaSort;
          public pageNumber?: number;
          public pageSize?: number;
          public paged?: boolean;
          public unpaged?: boolean;
  
}