/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeInformation } from './content-info';
import { TYPEINFORMATION_VISUAL } from '../constants/constant';

export class ContentInfoSchema {
  baunitIdE?: string | undefined = '';
  executionId?: string | undefined | null = '';
  schemas?: string[] = [];
  content?: any;
  typeInformation?: TypeInformation;
  flagData?: string = '';
  resources?: string[] = [];

  constructor(
    baunitIdE?: string,
    content: any = null,
    executionId: string | null = '',
    schemas: string[] = [],
    typeInformation: TypeInformation = TYPEINFORMATION_VISUAL,
    flagData = '',
    resources: string[] = []
  ) {
    this.content = content;
    this.baunitIdE = baunitIdE;
    this.executionId = executionId;
    this.schemas = schemas;
    this.typeInformation = typeInformation;
    this.flagData = flagData;
    this.resources = resources;
  }
}
