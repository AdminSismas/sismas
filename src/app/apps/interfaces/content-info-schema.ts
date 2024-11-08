import { TypeInformation } from './content-info';
import { TYPEINFORMATION_VISUAL } from '../constants/constant';

export class ContentInfoSchema {
  baunitIdE?: string | undefined = '';
  executionId?: string | undefined | null = '';
  schemas?:string[] = [];
  content?: any;
  typeInformation?: TypeInformation

  constructor(baunitIdE?: string,
              content: any = null,
              executionId: string | null = '',
              schemas: string[] = [],
              typeInformation: TypeInformation = TYPEINFORMATION_VISUAL,
            ) {
    this.content = content;
    this.baunitIdE = baunitIdE;
    this.executionId = executionId;
    this.schemas = schemas;
    this.typeInformation = typeInformation;
  }
}
