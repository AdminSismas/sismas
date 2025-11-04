/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeInformation } from '@shared/interfaces';
import { TYPE_INFORMATION_VISUAL } from '@shared/constants';

export class ContentInfoSchema {
  baunitIdE?: string | undefined | null = '';
  executionId?: string | undefined | null = '';
  schemas?: string[] = [];
  content?: any;
  typeInformation?: TypeInformation;
  flagData?: string = '';
  resources?: string[] = [];
  rulePage?: string = '';
  levelInfo?: number = 0;

  constructor(
    baunitIdE?: string | undefined | null,
    content: any = null,
    executionId: string | null = '',
    schemas: string[] = [],
    typeInformation: TypeInformation = TYPE_INFORMATION_VISUAL,
    flagData = '',
    resources: string[] = [],
    rulePage = ''
  ) {
    this.content = content;
    this.baunitIdE = baunitIdE;
    this.executionId = executionId;
    this.schemas = schemas;
    this.typeInformation = typeInformation;
    this.flagData = flagData;
    this.resources = resources;
    this.rulePage = rulePage;
  }
}
